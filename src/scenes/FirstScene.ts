/* eslint-disable @typescript-eslint/no-empty-function */
import Phaser from 'phaser'

export default class FirstScene extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup
	private player?: Phaser.Physics.Arcade.Sprite
    //private playersToOrder?: Phaser.Physics.Arcade.Group
    //private numbers?: Phaser.Physics.Arcade.Sprite
	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    
    constructor() {
		super('first-scene')
	}
    
    preload() {
        this.load.image('bgCastle', 'assets/bg_castle.png')
        this.load.atlasXML('alienBeige', 'assets/atlas/alienBeige.png', 'assets/atlas/alienBeige.xml')
        this.load.image('grass', 'assets/ambient/grass/grass.png')
        this.load.image('liquidLava', 'assets/ambient/lava/tilemap.png')
        this.load.image('number0', 'assets/UI/numbers/hud_0.png')
        this.load.image('number1', 'assets/UI/numbers/hud_1.png')
        this.load.atlas('number', 'assets/UI/numbers.png', 'assets/UI/numbers.json')
    }   

    create() {
        /*const mapping = [["grassHalfLeft.png","grassHalfMid.png","grassHalfRight.png"]]
        const map = this.make.tilemap({data: mapping, tileHeight: 70, tileWidth: 70})
        map.addTilesetImage('ambientTiles')
        const layer = map.createLayer(0, 'ambientTiles', 0, 0)
        
        tentando fazer tilemap sem tiled
        
        const array = [
            Array.from({ length: 11 }, (_, index) => index), // Primeira linha de 0 a 10
            Array.from({ length: 11 }, (_, index) => index + 11), // Segunda linha de 11 a 20
            Array.from({ length: 11 }, (_, index) => index + 21) // Terceira linha de 21 a 30
        ]*/

        //bg temporarario
        this.add.image(this.scale.width/2, this.scale.height/2,'bgCastle')
    
        //plataformas
        this.platforms = this.physics.add.staticGroup()
        this.platforms.create(100, 250, 'grass')

        //const randomNumbers = Array.from({ length: 7 }, () => Math.floor(Math.random() * 8));
        const numberOfVariables = 7
        for (let i = 0; i < numberOfVariables; i++) {
            const numeroDecimal = Math.random();
            const numeroAleatorio = Math.floor(numeroDecimal * 10);
            const x = (380+(i*70))
            const y = 250

            const platform : Phaser.Physics.Arcade.StaticGroup = this.platforms.create(x, y, 'grass')
            const playerToOrder = this.physics.add.sprite(0, 0,'alienBeige', 'alienBeige_stand.png')
            const orderNumber = this.add.image(playerToOrder.x, playerToOrder.y-70,'number',`hud_${numeroAleatorio}.png`)

            const container = this.add.container(x, y-80, [ playerToOrder, orderNumber ])
            
            playerToOrder.setBounce(0.1);
            playerToOrder.setCollideWorldBounds(true)
            playerToOrder.setSize(50, 90);  //hitbox
            
            //fisica
            this.physics.add.collider(playerToOrder, platform)
        }

        this.player = this.physics.add.sprite(100, 160, 'alienBeige')
        this.player.setBounce(0.1)
		this.player.setCollideWorldBounds(true)
        this.player.setSize(50, 90);  //hitbox
        this.physics.add.collider(this.player, this.platforms)
   
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

        this.cursors = this.input.keyboard?.createCursorKeys()
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
		if((this.cursors.up?.isDown || this.cursors.space.isDown) && this.player?.body?.touching.down) {
			this.player?.setVelocityY(-200)
            this.player?.anims.play('jump')
		}
    }
}