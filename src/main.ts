import Phaser from 'phaser'
import FirstScene from './scenes/FirstScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 1024,
	height: 768,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: true
		},
	},
	scene: [FirstScene],
}

export default new Phaser.Game(config)