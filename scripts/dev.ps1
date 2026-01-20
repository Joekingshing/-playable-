param(
  [string]$App = "api",
  [string]$DurationSeconds = "0"
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$backend = $null
$frontend = $null
$timedOut = $false

function Resolve-ArgValue {
  param(
    [string]$Value,
    [string]$Name
  )

  if ($Value -like ($Name + "=*")) {
    return $Value.Substring($Name.Length + 1)
  }

  return $Value
}

$App = Resolve-ArgValue -Value $App -Name "app"
$DurationSeconds = Resolve-ArgValue -Value $DurationSeconds -Name "duration"

$durationValue = 0
if (-not [int]::TryParse($DurationSeconds, [ref]$durationValue)) {
  throw "Invalid duration value: $DurationSeconds"
}

function Start-ChildProcess {
  param(
    [string[]]$Command,
    [string]$WorkingDirectory
  )

  $argumentList = @("/c") + $Command
  return Start-Process -FilePath "cmd.exe" -ArgumentList $argumentList -WorkingDirectory $WorkingDirectory -PassThru -NoNewWindow
}

Push-Location $repoRoot
try {
  & docker compose -f docker/compose.yml --profile db up -d
  if ($LASTEXITCODE -ne 0) {
    throw "docker compose failed with exit code $LASTEXITCODE"
  }

  $backend = Start-ChildProcess -Command @("pnpm", "-C", "backend", "start:dev", $App) -WorkingDirectory $repoRoot
  $frontend = Start-ChildProcess -Command @("pnpm", "-C", "frontend", "dev") -WorkingDirectory $repoRoot

  $deadline = $null
  if ($durationValue -gt 0) {
    $deadline = (Get-Date).AddSeconds($durationValue)
  }

  while ($true) {
    if ($backend.HasExited -or $frontend.HasExited) {
      break
    }
    if ($deadline -and (Get-Date) -ge $deadline) {
      $timedOut = $true
      break
    }
    Start-Sleep -Seconds 1
  }

  if (-not $timedOut) {
    if ($backend.HasExited -and $backend.ExitCode -ne 0) {
      throw "backend exited with code $($backend.ExitCode)"
    }

    if ($frontend.HasExited -and $frontend.ExitCode -ne 0) {
      throw "frontend exited with code $($frontend.ExitCode)"
    }
  }
}
finally {
  if ($backend -and -not $backend.HasExited) {
    $backend.Kill()
  }
  if ($frontend -and -not $frontend.HasExited) {
    $frontend.Kill()
  }
  Pop-Location
}
