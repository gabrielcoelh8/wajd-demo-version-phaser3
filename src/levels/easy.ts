import Phaser from "phaser";

export default class Easy extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup

    private numbersToOrder?: Phaser.Physics.Arcade.Group

	private player!: Phaser.Physics.Arcade.Sprite

	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys

    private ground?: Phaser.GameObjects.TileSprite

    private labels?: Phaser.GameObjects.Text

    private lifes: integer = 7

    private playerPlatformCollider?: Phaser.Physics.Arcade.Collider

    private playerToOrderPlatformCollider?: Phaser.Physics.Arcade.Collider

    private playerToOrderMainPlayerCollider?: Phaser.Physics.Arcade.Collider

    private deathLavaOverlap?: Phaser.Physics.Arcade.Collider

    private playerUp?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

    private numberUp?: Phaser.GameObjects.Sprite

    private grabUp: boolean = false

    constructor() {
        super()
    }

    preload(): void {
        //local assets
    }

    create(): void {
        this.player = this.physics.add.sprite(100, 160, 'alienBeige')
        this.lifes = 7
        this.cursors = this.input.keyboard?.createCursorKeys()
        
        //tiles
        this.add.image(this.scale.width/2, this.scale.height/2,'bgGrasslands').setScale(1.5) //background
        this.add.tileSprite(this.scale.width/2, this.scale.height-170, this.scale.width, 70, 'lavaTop').setScale(1).setName('lavaTop')  //superficie da lava
        this.ground = this.add.tileSprite(this.scale.width/2, this.scale.height-70, this.scale.width, 140, 'lava').setScale(1).setName('lavaLiquid') //corpo da lava
        this.physics.add.existing(this.ground, true)
        
        //plataformas
        this.platforms = this.physics.add.staticGroup()
        this.platforms.create(100, 250, 'grass')

        //player
        this.player.setDepth(1)
        this.player.setBounce(0.1)
        this.player.setSize(50, 90)
        this.player.setCollideWorldBounds(true)
        this.playerPlatformCollider = this.physics.add.collider(this.player, this.platforms)
        
        //overlap com a lava
        this.deathLavaOverlap = this.physics.add.overlap(this.player, this.ground, () => this.handleDeathLava)
        
        //vidas label TODO: HEART
        this.labels = this.add.text(10, 10, `Life: ${this.lifes}`).setScrollFactor(0);
        this.labels.setShadow(1, 1, '#000000', 2);

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
            const platform:Phaser.GameObjects.Sprite = this.platforms.create(x, y, 'grass')
            const playerToOrder = this.physics.add.sprite(x, y-80, `alien${alienColors[alienKeys[i]]}`, `alien${alienColors[alienKeys[i]]}_stand.png`).setName(`${i}`)
            const number = this.add.sprite(playerToOrder.x, playerToOrder.y, 'number',`hud_${numerosAleatorios[i]}.png`)
            this.numbersToOrder?.add(number, true)
            this.platforms.add(platform)

            //physics
            playerToOrder.setState('')
            playerToOrder.setBounce(0.7)
            playerToOrder.setCollideWorldBounds(true)
            playerToOrder.setState('down')

            this.playerPlatformCollider = this.physics.add.collider(playerToOrder, this.platforms)
            this.physics.add.overlap(this.player, playerToOrder, () => this.handleOverlapUp(this.player, playerToOrder, number))
        }

    }

    update(): void {
        this.labels?.setText(`Life: ${this.lifes}`)

        /////melhorar isso (odeio If)
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
        else if (this.cursors.down?.isDown) {
			this.player?.anims.play('duck', true)
		}
		else {
			this.player?.setVelocityX(0)
			this.player?.anims.play('turn', true)
		}

		//jump
		if((this.cursors.up?.isDown) && this.player?.body?.touching.down && this.player.state!=='morto') {
			this.player?.setVelocityY(-200)
            this.player?.anims.play('jump')
		}

        if(this.cursors.up?.isDown && this.player.state!=='morto' && this.grabUp) {
			this.player?.setVelocityY(-400)
            this.player?.anims.play('jump')
		}

       
        if (this.grabUp && this.playerUp && this.numberUp) {
            this.playerUp.x = this.player.x
            this.numberUp.x = this.playerUp.x
            this.numberUp.y = this.playerUp.y
        } else if(this.playerUp && this.numberUp) {
            this.numberUp.x = this.playerUp.x
            this.numberUp.y = this.playerUp.y
        }

        switch(this.player?.state) {
            case 'morto':
                this.player?.anims.play('duck', true)
                this.player.setVelocityY(-10)
                this.player?.setVelocityX(0)
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

            playerToOrder.setBounce(0)
            playerToOrder.setY(_mainPlayer.y-this.player.height)
            playerToOrder.setState('up')

            this.grabUp = true
        }
        else if (this.cursors?.space.isUp && playerToOrder.state === 'up' && this.playerToOrderMainPlayerCollider) {
            this.playerToOrderMainPlayerCollider.active = false

            playerToOrder.setBounce(0.7)
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