import Phaser from 'phaser'
import Menu from './Phaser/scenes/menu'
import Preloader from './Phaser/scenes/bootstrap'
import Easy from './Phaser/scenes/levels/main'
import HealthController from './Phaser/system/HealthSystem'
import Health from './Phaser/scenes/interface'

export const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.CANVAS,
	pixelArt: true,
	scale: {
		parent: 'game-container',
		width: 1024,
		height: 768
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 500 },
			debug: true
		},
	},
	backgroundColor: '#245b50'
}
export const game = new Phaser.Game(config)

const customEmitter = new Phaser.Events.EventEmitter();
const customHealthComponent = new HealthController(customEmitter);

//cenas
game.scene.add('preloader', new Preloader())
game.scene.add('menu', new Menu())

//levels
game.scene.add('health_ui', new Health(customEmitter, customHealthComponent))
game.scene.add('easy_level', new Easy(customHealthComponent))

//boot
game.scene.start('preloader')