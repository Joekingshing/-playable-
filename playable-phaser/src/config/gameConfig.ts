import Phaser from 'phaser'
import { MainScene } from '../game/scenes/MainScene'

export const createGameConfig = (
  parent?: HTMLElement,
): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent,
  backgroundColor: '#0b1320',
  scene: [MainScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
})
