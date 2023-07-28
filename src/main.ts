import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'
import FirstScene from './scenes/FirstScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 1024,
	height: 512,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: true
		},
	},
	scene: [FirstScene, HelloWorldScene],
}

export default new Phaser.Game(config)