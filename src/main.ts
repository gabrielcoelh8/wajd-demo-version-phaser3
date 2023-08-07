import Phaser from 'phaser'
import Menu from './scenes/menu'
import Preloader from './scenes/preloader'
import Easy from './levels/easy'

export const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.CANVAS,
	pixelArt: true,
	scale: {
		parent: 'app',
		width: 1024,
		height: 768	
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: true
		},
	},
	backgroundColor: '#14282b'
}
const game = new Phaser.Game(config)

//cenas
game.scene.add('preloader', new Preloader())
game.scene.add('menu', new Menu())

//levels
game.scene.add('easy', new Easy())

//boot
game.scene.start('preloader')