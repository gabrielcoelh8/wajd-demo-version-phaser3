/* eslint-disable @typescript-eslint/no-empty-function */
import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {
    
    constructor() {
		super()
	}

    preload() {
        //global assets
        this.load.image('bgCastle', 'assets/background/bg_castle.png')
        this.load.image('bgDesert', 'assets/background/bg_desert.png')
        this.load.image('bgGrasslands', 'assets/background/bg_grasslands.png')

        this.load.atlas('kamila', 'assets/atlas/kamila/kamila.png', 'assets/atlas/kamila/kamila.json')
        this.load.atlasXML('alienBeige', 'assets/atlas/aliens/alienBeige.png', 'assets/atlas/aliens/alienBeige.xml')
        this.load.atlasXML('alienPink', 'assets/atlas/aliens/alienPink.png', 'assets/atlas/aliens/alienPink.xml')
        this.load.atlasXML('alienGreen', 'assets/atlas/aliens/alienGreen.png', 'assets/atlas/aliens/alienGreen.xml')
        this.load.atlasXML('alienBlue', 'assets/atlas/aliens/alienBlue.png', 'assets/atlas/aliens/alienBlue.xml')
        this.load.atlasXML('alienYellow', 'assets/atlas/aliens/alienYellow.png', 'assets/atlas/aliens/alienYellow.xml')

        this.load.atlasXML('tiles', 'assets/ambient/tiles_spritesheet.png', 'assets/ambient/tiles_spritesheet.xml')
        this.load.image('grass', 'assets/ambient/grass/grass.png')
        this.load.image('lava', 'assets/ambient/lava/liquidLava.png')
        this.load.image('lavaTop', 'assets/ambient/lava/liquidLavaTop.png')
        this.load.atlas('number', 'assets/UI/numbers/numbers.png', 'assets/UI/numbers/numbers.json')   
    }

    create() {
        this.scene.start('menu')

        //global anims
        this.anims.create(
            {
             key: 'walk',
             frames: this.anims.generateFrameNames('alienBeige', {
                 prefix: 'alienBeige_walk',
                 suffix:'.png',
                 start: 1,
                 end: 2
             }),
             frameRate: 5,
             repeat: -1
            }
         )
    
        this.anims.create(
            {
            key: 'turn',
            frames: [
            { key: 'alienBeige', frame: 'alienBeige_stand.png'}
            ],
            frameRate: 5,
            repeat: -1
            }
        )

        this.anims.create(
            {
            key: 'jump',
            frames: [
            { key: 'alienBeige', frame: 'alienBeige_jump.png' }
            ],
            frameRate: 5,
            repeat: -1
            }
        )
        
        this.anims.create(
            {
            key: 'duck',
            frames: [
            { key: 'alienBeige', frame: 'alienBeige_hurt.png' }
            ],
            frameRate: 5,
            repeat: -1
            }
        )
    }
}