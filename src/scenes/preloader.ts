/* eslint-disable @typescript-eslint/no-empty-function */
import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
    private MAIN_CHAR = {
        KEY: 'alienBeige',
        SUFFIX: '.png',
    }
    private CHARS = {
        KEYS: [
            'alienBeige',
            'alienPink',
            'alienGreen',
            'alienBlue',
            'alienYellow'
        ],
        MINI: 'alienMini',
        SUFFIX: '.png',
        ACTIONS: [
            'stand',
            'jump',
            'duck'
        ]
    }

    constructor() {
		super()
	}

    preload() {
        //global assets
        this.load.image('bgCastle', 'assets/background/bg_castle.png')
        this.load.image('bgDesert', 'assets/background/bg_desert.png')
        this.load.image('bgGrasslands', 'assets/background/bg_grasslands.png')

        this.load.atlas('kamila', 'assets/atlas/kamila/kamila.png', 'assets/atlas/kamila/kamila.json')
        this.load.atlas('alienMini', 'assets/atlas/aliens/mini/alien_mini.png', 'assets/atlas/aliens/mini/alien_mini.json')

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
        this.createMainCharAnims()
        this.createOthersCharAnims()
    }

    createMainCharAnims() {
        //multiple frames (e. g. walk)
        this.anims.create(
            {
             key: `${this.MAIN_CHAR.KEY}_walk`,
             frames: this.anims.generateFrameNames(this.MAIN_CHAR.KEY, {
                 prefix: `${this.MAIN_CHAR.KEY}_walk`,
                 suffix: this.MAIN_CHAR.SUFFIX,
                 start: 1,
                 end: 2
             }),
             frameRate: 5,
             repeat: -1,
            }
         )

        //single frame
        this.CHARS.KEYS.forEach((KEY:string) => {
            this.CHARS.ACTIONS.forEach((ACTION:string) => {
                this.anims.create(
                    {
                    key: `${KEY}_${ACTION}`,
                    frames: [
                        { 
                        key: KEY, 
                        frame: `${KEY}_${ACTION}${this.MAIN_CHAR.SUFFIX}`
                        }
                    ],
                    frameRate: 5,
                    repeat: -1
                    }
                )
            })
        })
    }

    createOthersCharAnims() {
        this.CHARS.KEYS.forEach((KEY:string) => {
            this.anims.create(
                {
                key: `${KEY}_mini`,
                frames: [
                    { 
                    key: this.CHARS.MINI, 
                    frame: `${KEY}_mini${this.CHARS.SUFFIX}` 
                    }
                ],
                frameRate: 5,
                repeat: -1
                }
            )
        })
    }
}