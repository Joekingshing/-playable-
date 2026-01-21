import Phaser from 'phaser'
import { createGameConfig } from '../config/gameConfig'

export const createGame = (parent: HTMLElement): Phaser.Game => {
  const config = createGameConfig(parent)
  return new Phaser.Game(config)
}
