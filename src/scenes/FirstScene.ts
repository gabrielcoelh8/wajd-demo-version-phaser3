/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import Phaser from 'phaser'


export default class FirstScene extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup
	private player?: Phaser.Physics.Arcade.Sprite
	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private ground?: Phaser.GameObjects.TileSprite

    constructor() {
		super('first-scene')
    }
    
    preload() {
        this.load.image('bgCastle', 'assets/bg_castle.png')
        this.load.atlasXML('alienBeige', 'assets/atlas/aliens/alienBeige.png', 'assets/atlas/aliens/alienBeige.xml')
        this.load.image('grass', 'assets/ambient/grass/grass.png')
        this.load.image('lava', 'assets/ambient/lava/liquidLavaTop.png')
        this.load.atlas('number', 'assets/UI/numbers.png', 'assets/UI/numbers.json')
    }   

    create() {
        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
        
        //tiles
        this.add.image(this.scale.width/2, this.scale.height/2,'bgCastle').setScale(2)
        this.ground = this.add.tileSprite(this.scale.width/2, this.scale.height-30, this.scale.width, 70, 'lava').setScale(1).setName('groundtiles')
        this.physics.add.existing(this.ground, true)
        

        //plataformas
        this.platforms = this.physics.add.staticGroup()
        this.platforms.create(100, 250, 'grass')
        this.player = this.physics.add.sprite(100, 160, 'alienBeige')
        this.player.setBounce(0.1)
        this.physics.add.collider(this.player, this.platforms)

        //overlap com ground
        const p1 = this.player
        this.physics.add.overlap(p1, this.ground, () => this.handleDeathLava(p1))
        
        //numeros aleatorios
        const numberOfVariables = 7
        const numeros = Array.from({ length: numberOfVariables }, (_, index) => index);
        const numerosAleatorios = this.shuffleNumeros(numeros);
        
        for (let i = 0; i < numberOfVariables; i++) {
            const x = (380+(i*70))
            const y = 250

            //criação
            const platform : Phaser.Physics.Arcade.StaticGroup = this.platforms.create(x, y, 'grass')
            const playerToOrder = this.physics.add.sprite(x, y-80,'alienBeige', 'alienBeige_stand.png')
            const orderNumber = this.physics.add.sprite(playerToOrder.x, playerToOrder.y-70,'number',`hud_${numerosAleatorios[i]}.png`)
            
            //physics
            playerToOrder.setBounce(0.7)
            playerToOrder.setCollideWorldBounds(true)
            this.physics.add.collider(playerToOrder, platform)
            this.physics.add.collider(orderNumber, playerToOrder)
            this.physics.add.overlap(playerToOrder, this.player, () => this.handleOverlap(playerToOrder))
        }

        //animações
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
        //TODO consertar bug de cair ao agachar
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

        this.cursors = this.input.keyboard?.createCursorKeys()
    }

    update() {
        if (!this.cursors) {
			return
		} 
		
        if (this.cursors.left?.isDown) {
			this.player?.setVelocityX(-160)
            this.player?.setFlipX(true)
			this.player?.anims.play('walk', true)
		} 
		else if (this.cursors.right?.isDown) {
			this.player?.setVelocityX(160)
            this.player?.setFlipX(false)
			this.player?.anims.play('walk', true)
		}
        else if (this.cursors.down?.isDown) {
			this.player?.anims.play('duck', true)
		}
		else {
            this.player?.setSize(50, 90)
			this.player?.setVelocityX(0)
			this.player?.anims.play('turn', true)
		}

		//jump
		if((this.cursors.up?.isDown || this.cursors.space.isDown) && this.player?.body?.touching.down) {
			this.player?.setVelocityY(-200)
            this.player?.anims.play('jump')
		}

    }

    //Fisher–Yates shuffle
    shuffleNumeros(array:integer[]){
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
    }

    handleOverlap(playerToOrder:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
        playerToOrder.setState('marcado')
        if(playerToOrder.state == 'marcado') {
            playerToOrder.setAlpha(0.5)
        }
    }

    handleDeathLava(player:Phaser.Physics.Arcade.Sprite) {
        player.anims.play('duck', true)
        player.setVelocityY(50)
        player.setTint(0xff0000)
    }
}