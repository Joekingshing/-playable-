import Phaser from 'phaser'

export const createCenteredText = (
  scene: Phaser.Scene,
  text: string,
  style: Phaser.Types.GameObjects.Text.TextStyle = {},
) => {
  const { width, height } = scene.scale
  const textObject = scene.add.text(width / 2, height / 2, text, {
    fontFamily: 'Arial, sans-serif',
    fontSize: '32px',
    color: '#ffffff',
    ...style,
  })
  textObject.setOrigin(0.5, 0.5)
  return textObject
}
