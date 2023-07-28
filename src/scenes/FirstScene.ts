/* eslint-disable @typescript-eslint/no-empty-function */
import Phaser from 'phaser'

export default class FirstScene extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup
	private player?: Phaser.Physics.Arcade.Sprite
	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    
    constructor() {
		super('first-scene')
	}
    
    preload() {
        this.load.image('bgCastle', 'assets/bg_castle.png')
        this.load.atlasXML('alienBeige', 'assets/atlas/alienBeige.png', 'assets/atlas/alienBeige.xml')
        this.load.image('grass', 'assets/ambient/grass/grass.png')
        
        ////TESTING
        this.load.multiatlas('grassAtlas','assets/ambient/grass/Grass.json')
    }   

    create() {
        //bg temporarario
        this.add.image(1024/2, 512/2,'bgCastle')
        console.log('grassAtlas')

        //plataformas
        this.platforms = this.physics.add.staticGroup()
        this.platforms.create(600, 400, 'grass')

        ///TESTING {https://github.com/photonstorm/phaser3-examples/blob/master/public/src/textures/multi%20atlas.js}
        //this.add.image(0, 0, 'grass', 'grass.png').setOrigin(0);
        

        this.player = this.physics.add.sprite(500, 0, 'alienBeige')
        this.player.setBounce(0.2)
		this.player.setCollideWorldBounds(true)
   
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

        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update() {
        if (!this.cursors) {
			return
		} 
		else if (this.cursors.left?.isDown) {
			this.player?.setVelocityX(-160)
            this.player?.setFlipX(true)
			this.player?.anims.play('walk', true)
		} 
		else if (this.cursors.right?.isDown) {
			this.player?.setVelocityX(160)
            this.player?.setFlipX(false)
			this.player?.anims.play('walk', true)
		}
		else {
			this.player?.setVelocityX(0)
			this.player?.anims.play('turn', true)
		}

		//jump
		if(this.cursors.up?.isDown || this.cursors.space.isDown /*&& this.player?.body.touching.down*/) {
			this.player?.setVelocityY(-330)
            this.player?.anims.play('jump')
		}
    }
}