import Phaser from 'phaser'
import Menu from './scenes/menu'
import Preloader from './scenes/preloader'
import Easy from './levels/easy'
import HealthController from './components/healthController'
import Health from './scenes/health'

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
	backgroundColor: '#245b50'
}
const game = new Phaser.Game(config)
const customEmitter = new Phaser.Events.EventEmitter();
const customLifeScene = new HealthController(customEmitter);

//cenas
game.scene.add('preloader', new Preloader())
game.scene.add('menu', new Menu())

//levels
game.scene.add('health_ui', new Health(customEmitter, customLifeScene))
game.scene.add('easy_level', new Easy(customLifeScene))

//boot
game.scene.start('preloader')