/* eslint-disable @typescript-eslint/no-unused-vars */
import Phaser from "phaser";

export default class Easy extends Phaser.Scene {
    #platforms?: Phaser.Physics.Arcade.StaticGroup

    #numbersToOrder?: Phaser.Physics.Arcade.Group

	#player!: Phaser.Physics.Arcade.Sprite

	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys

    //private ground?: Phaser.GameObjects.TileSprite

    private labels?: Phaser.GameObjects.Text

    private playerPlatformCollider?: Phaser.Physics.Arcade.Collider

    //private playerToOrderPlatformCollider?: Phaser.Physics.Arcade.Collider

    private playerToOrderMainPlayerCollider?: Phaser.Physics.Arcade.Collider

    //private deathLavaOverlap?: Phaser.Physics.Arcade.Collider

    private playerUp?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

    private numberUp?: Phaser.GameObjects.Sprite

    private lifes: integer = 7

    private grabUp = false

    //private fall = false

    private background!: Phaser.GameObjects.TileSprite

    private farBuildings!: Phaser.GameObjects.TileSprite

    private buildings!: Phaser.GameObjects.TileSprite

    private foreground!: Phaser.GameObjects.TileSprite

    constructor() {
        super()
    }

    preload(): void {
        //local assets
        this.load.atlas('parallax2', 'assets/background/parallax/v2/parallax.png', 'assets/background/parallax/v2/parallax.json')
    }

    create(): void {
        this.#player = this.physics.add.sprite(100, 160, 'alienBeige')
      
        this.lifes = 7
        this.cursors = this.input.keyboard?.createCursorKeys()
        
        //parallax
        this.background = this.add.tileSprite(490, 250, 272, this.scale.height, 'parallax2', 'skill-desc_0003_bg.png').setScale(4)
        this.farBuildings = this.add.tileSprite(0, 400, this.scale.width, 142, 'parallax2', 'skill-desc_0002_far-buildings.png').setScale(3)
        this.buildings = this.add.tileSprite(0, 430, this.scale.width, 142, 'parallax2', 'skill-desc_0001_buildings.png').setScale(3)
        this.foreground = this.add.tileSprite(0, 670, this.scale.width, 142, 'parallax2', 'skill-desc_0000_foreground.png').setScale(3)

        this.background.setDepth(-3)
        this.farBuildings.setDepth(-2)
        this.buildings.setDepth(-1)
        this.#player.setDepth(0)
        this.foreground.setDepth(1)

        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height, false, false, false, true)

        //filter
        const filter = this.make.renderTexture({
            width: this.scale.width,
            height: this.scale.height,
            x: this.scale.width/2,
            y: this.scale.height/2
        }, true)
        filter.fill(0x0a2948, 1)
        filter.setAlpha(0.3)
        filter.setDepth(2)

        //plataformas
        this.#platforms = this.physics.add.staticGroup()

        this.#platforms.create(100, 250, 'tiles', 'stoneCenter_rounded.png')

        //player
        this.#player.setDepth(1)
        this.#player.setBounce(0.1)
        this.#player.setSize(50, 90)
        this.#player.setCollideWorldBounds(true)
        
        
        this.playerPlatformCollider = this.physics.add.collider(this.#player, this.#platforms)        

        //overlap com a lava
        //this.deathLavaOverlap = this.physics.add.overlap(this.player, this.ground, () => this.handleDeathLava(this.player))
        
        //vidas label TODO: HEART
        this.labels = this.add.text(10, 10, `Life: ${this.lifes}`).setScrollFactor(0);
        this.labels.setShadow(1, 1, '#000000', 2);
        this.labels.setDepth(3)

        //numeros aleatorios
        const numberOfVariables = 4
        const numeros = Array.from({ length: numberOfVariables }, (_, index) => index); //array de 0 ao tamanho da variável acima
        const numerosAleatorios = this.shuffleNumeros(numeros);

        //cor do alien
        const alienColors = [
            /*'Beige', */
            'Blue', 
            'Green', 
            'Yellow', 
            'Pink'
        ]
        let alienKeys = Array.from({ length: alienColors.length }, (_, index) => index);  //armazena o index de cada item do array alienColors, ignorando o value
        alienKeys = this.shuffleNumeros(alienKeys)  //cor aleatoria

        //criar aliens e plataformas
        for (let i = 0; i < numberOfVariables; i++) {
            const x = (380+(i*140))
            const y = 250
            
            //criação
            const platform:Phaser.GameObjects.Sprite = this.#platforms.create(x, y, 'tiles', 'stone.png')
            const playerToOrder = this.physics.add.sprite(x, y-80, `alien${alienColors[alienKeys[i]]}`, `alien${alienColors[alienKeys[i]]}_stand.png`).setName(`${i}`)
            const number = this.add.sprite(playerToOrder.x, playerToOrder.y, 'number',`hud_${numerosAleatorios[i]}.png`)
            this.#numbersToOrder?.add(number, true)
            this.#platforms.add(platform)

            //physics
            playerToOrder.setInteractive()
            playerToOrder.setState('')
            playerToOrder.setBounce(0.7)
            playerToOrder.setCollideWorldBounds(false)
            playerToOrder.setState('down')

            this.playerPlatformCollider = this.physics.add.collider(playerToOrder, this.#platforms)
            this.physics.add.overlap(this.#player, playerToOrder, () => this.handleOverlapUp(this.#player, playerToOrder, number))
        }
    }

    update(): void {
        console.log(this.#player.body?.collideWorldBounds)

        this.labels?.setText(`Life: ${this.lifes}`)

        /////melhorar isso (odeio If)
        if (!this.cursors) {
			return
		} 
        else if (this.cursors.left?.isDown) {
			this.#player?.setVelocityX(-160)
            this.#player?.setFlipX(true)
			this.#player?.anims.play('walk', true)
		} 
		else if (this.cursors.right?.isDown) {
			this.#player?.setVelocityX(160)
            this.#player?.setFlipX(false)
			this.#player?.anims.play('walk', true)
		}
        else if (this.cursors.down?.isDown) {
            this.playerPlatformCollider?.destroy()
			this.#player?.anims.play('duck', true)
		}
		else {
			this.#player?.setVelocityX(0)
			this.#player?.anims.play('turn', true)
		}

		//jump
		if((this.cursors.up?.isDown) && this.#player?.body?.touching.down && this.#player.state!=='morto') {
			this.#player?.setVelocityY(-200)
            this.#player?.anims.play('jump')
		}

        if(this.cursors.up?.isDown && this.#player?.body?.touching.down && this.#player.state!=='morto' && this.grabUp) {
			this.#player?.setVelocityY(-420)
            this.#player?.anims.play('jump')
		}

        //grab behavior
        if (this.grabUp && this.playerUp && this.numberUp) {
            this.playerUp.x = this.#player.x
            this.numberUp.x = this.playerUp.x
            this.numberUp.y = this.playerUp.y
        } else if(this.playerUp && this.numberUp) {
            this.numberUp.x = this.playerUp.x
            this.numberUp.y = this.playerUp.y
        }

        //death
        switch(this.#player?.state) {
            case 'morto':
                this.#player?.anims.play('duck', true)
                this.#player.setVelocityY(-10)
                this.#player?.setVelocityX(0)
            break;
        }
    }

    //Fisher–Yates shuffle
    shuffleNumeros(array:integer[]): Array<integer> {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
    }
    
    handleOverlapUp(_mainPlayer: Phaser.Physics.Arcade.Sprite, playerToOrder:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, numberUp: Phaser.GameObjects.Sprite): void {
        if(this.cursors?.space.isDown && playerToOrder.state === 'down' && this.grabUp == false) {
            this.playerUp = playerToOrder
            this.numberUp = numberUp
            this.playerToOrderMainPlayerCollider = this.physics.add.collider(playerToOrder,_mainPlayer)
            
            playerToOrder.play('duck')
            playerToOrder.setBounce(0)
            playerToOrder.setY(_mainPlayer.y-this.#player.height)
            playerToOrder.setState('up')

            this.grabUp = true
        }
        else if (this.cursors?.space.isUp && playerToOrder.state === 'up' && this.playerToOrderMainPlayerCollider) {
            this.playerToOrderMainPlayerCollider.active = false

            //playerToOrder.setBounce(0.7)
            playerToOrder.setState('down')

            this.grabUp = false
        }
        return
    }
    
    handleDeathLava(player:Phaser.Physics.Arcade.Sprite): void {
        this.lifes = 0
            
        player.setState('morto')
        player.setVelocityY(-10)
        player.setTint(0xff0000)
    
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.start('menu')
                }, 
            loop: false
        })
    }
}