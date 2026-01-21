import Phaser from 'phaser'
import { createCenteredText } from '../components/createCenteredText'
import { eventBus } from '../EventBus'

export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
  }

  create() {
    this.cameras.main.setBackgroundColor('#0b1320')
    createCenteredText(this, 'Playable Phaser')
    eventBus.emit('scene-ready', this)
  }
}
