# 简报：upload-filename-suffix

## 任务
- 上传文件名改为后缀拼接，唯一串规则不变

## 变更
- backend/apps/api/src/modules/upload/upload.service.ts 调整文件名拼接位置

## 验证
- (cd "E:\_wt\feat-upload-filename-suffix\backend" && pnpm build)

## 备注
- 上传接口与返回结构未变更
