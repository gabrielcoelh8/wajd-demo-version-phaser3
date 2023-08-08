/* eslint-disable @typescript-eslint/no-unused-vars */
import Phaser from "phaser";

export default class Easy extends Phaser.Scene {
    private MAIN_CHAR_KEY = 'alienBeige'

    //private platforms?: Phaser.Physics.Arcade.StaticGroup

    //private numbersToOrder?: Phaser.Physics.Arcade.Group

    //private playersToOrder?: Phaser.Physics.Arcade.Group
    
    //private playerPlatformCollider?: Phaser.Physics.Arcade.Collider

    //private playerToOrderPlatformCollider?: Phaser.Physics.Arcade.Collider

	private player!: Phaser.Physics.Arcade.Sprite

	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys

    private labels?: Phaser.GameObjects.Text

    private playerToOrderMainPlayerCollider?: Phaser.Physics.Arcade.Collider

    private playerUp?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

    private lifes: integer = 7

    private grabUp = false

    private background!: Phaser.GameObjects.TileSprite

    private farBuildings!: Phaser.GameObjects.TileSprite

    private buildings!: Phaser.GameObjects.TileSprite

    private foreground!: Phaser.GameObjects.TileSprite

    private zoneOfDeath!: Phaser.GameObjects.Zone

    constructor() {
        super()
    
    }

    preload(): void {
        //local assets
        this.load.atlas('parallax2', 'assets/background/parallax/v2/parallax.png', 'assets/background/parallax/v2/parallax.json')
    }

    restart() {
        this.player.state = 'alive'
    }

    create(): void {
        this.cursors = this.input.keyboard?.createCursorKeys()
        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height, false, false, false, true) ///collision only on down
        this.lifes = 7

        const player = this.physics.add.sprite(100, 160, this.MAIN_CHAR_KEY)
        const platforms = this.physics.add.staticGroup()
        const playersToOrder = this.physics.add.group()
        const numbersToOrder = this.physics.add.staticGroup()
        const filter = this.make.renderTexture({
            width: this.scale.width,
            height: this.scale.height,
            x: this.scale.width/2,
            y: this.scale.height/2
        }, true)
        const numberOfVariables = 4
        const numeros = Array.from({ length: numberOfVariables }, (_, index) => index); //array de 0 ao tamanho da variável acima
        const numerosAleatorios = this.shuffleNumeros(numeros);
        const alienColors = [
            /*'Beige', */
            'Blue', 
            'Green', 
            'Yellow', 
            'Pink'
        ]
        let alienKeys = Array.from({ length: alienColors.length }, (_, index) => index);
        /*
        sprites configuration
        */
        this.background = this.add.tileSprite(490, 250, 272, this.scale.height, 'parallax2', 'skill-desc_0003_bg.png').setScale(4)
        this.farBuildings = this.add.tileSprite(0, 400, this.scale.width, 142, 'parallax2', 'skill-desc_0002_far-buildings.png').setScale(3)
        this.buildings = this.add.tileSprite(0, 430, this.scale.width, 142, 'parallax2', 'skill-desc_0001_buildings.png').setScale(3)
        this.foreground = this.add.tileSprite(0, 670, this.scale.width, 142, 'parallax2', 'skill-desc_0000_foreground.png').setScale(3)
        
        this.background.setDepth(-3)
        this.farBuildings.setDepth(-2)
        this.buildings.setDepth(-1)
        this.foreground.setDepth(1)
        
        player.setDepth(1)
        player.setBounce(0.1)
        player.setSize(50, 90)
        player.setCollideWorldBounds(true)

        filter.fill(0x0a2948, 1)
        filter.setAlpha(0.3)
        filter.setDepth(2)
        /*
        plataforma auxiliar
        */
        platforms.create(100, 250, 'tiles', 'stoneCenter_rounded.png')
        /*
        vidas label TODO: HEART
        */
        this.labels = this.add.text(10, 10, `Life: ${this.lifes}`).setScrollFactor(0);
        this.labels.setShadow(1, 1, '#000000', 2);
        this.labels.setDepth(3)    
        /*
        platform and alien to order
        */
        alienKeys = this.shuffleNumeros(alienKeys)  //cor aleatoria
        for (let i = 0; i < numberOfVariables; i++) {
            const x = (380+(i*140))
            const y = 250
            const platform:Phaser.GameObjects.Sprite = this.add.sprite(x, y, 'tiles', 'stone.png').setSize(72,72)
            const playerToOrder = this.physics.add.sprite(
                x, 
                y-100, 
                `alien${alienColors[alienKeys[i]]}`, 
                `alien${alienColors[alienKeys[i]]}_stand.png`)
            playerToOrder.setData({ 
                name: `alien${alienColors[alienKeys[i]]}`, 
                number: numerosAleatorios[i]
            })
            playerToOrder.setState('onGround')
            playerToOrder.setBounce(0.7)
            playerToOrder.setCollideWorldBounds(false)
            playersToOrder.add(playerToOrder) 
            const number = this.add.sprite(x, y, 'number',`hud_${numerosAleatorios[i]}.png`)
            numbersToOrder.add(number, true) 
            platforms.add(platform)
                                
            
        }
        /*
        collision and overlap calls
        */
        this.physics.add.collider(player, platforms)

        playersToOrder.getChildren().forEach((playerToOrder)=>{
            const _playerToOrder = playerToOrder as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
            const numberOf = _playerToOrder.data.get('number') as number

            this.physics.add.collider(_playerToOrder, platforms)
            this.physics.add.overlap(player, playerToOrder, () => this.handleOverlapUp(player, _playerToOrder, numberOf))
            }
        )
        this.zoneOfDeath = this.add.zone(this.scale.width/2, this.scale.height-50, this.scale.width, 800);
        this.physics.add.existing(this.zoneOfDeath, true);
        this.physics.add.overlap(player, this.zoneOfDeath, () => this.handleDeathFall(player))

        this.player = player
    }

    update(): void {
        this.labels?.setText(`Life: ${this.lifes}`)

        /////TODO: ERROR IN PHYSICS
        if (!this.cursors) {
			return
		} 
        else if (this.cursors.left?.isDown) {
			this.player?.setVelocityX(-160)
            this.player?.setFlipX(true)
			this.player?.anims.play(`${this.MAIN_CHAR_KEY}_walk`, true)
		} 
		else if (this.cursors.right?.isDown) {
			this.player?.setVelocityX(160)
            this.player?.setFlipX(false)
			this.player?.anims.play(`${this.MAIN_CHAR_KEY}_walk`, true)
		}
        else if (this.cursors.down?.isDown) {
			this.player?.anims.play(`${this.MAIN_CHAR_KEY}_duck`, true)
		}
		else {
			this.player?.setVelocityX(0)
			this.player?.anims.play(`${this.MAIN_CHAR_KEY}_stand`, true)
		}

		//jump
		if(this.cursors.up?.isDown && this.player?.body?.touching.down) {
			this.player?.setVelocityY(-200)
            this.player?.anims.play(`${this.MAIN_CHAR_KEY}_walk`)
		}
/*
        if(this.cursors.up?.isDown && this.player?.body?.touching.down && this.player.state!=='morto' && this.grabUp) {
			this.player?.setVelocityY(-200)
            this.player?.anims.play(`${this.MAIN_CHAR_KEY}_stand`)
		}*/

        //grab behavior
        if (this.grabUp && this.playerUp) {
            this.playerUp.x = this.player.x
        }

        //death
        switch(this.player?.state) {
            case 'falling':
                //this.player.anims.play('duck', true)
                this.player.setVelocityY(500);
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
    
    handleOverlapUp(_mainPlayer: Phaser.Physics.Arcade.Sprite, playerToOrder:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, _numberOf: number): void {
        const name = playerToOrder.getData('name')
        const x = 66
        const y = 92
        
        if(this.cursors?.space.isDown && playerToOrder.state === 'onGround' && this.grabUp == false && _mainPlayer.state!=='falling') {
            this.playerUp = playerToOrder
            this.playerToOrderMainPlayerCollider = this.physics.add.collider(playerToOrder,_mainPlayer)
            playerToOrder.play(`${name}_mini`).setSize(54, 54)
            playerToOrder.setBounce(0)
            playerToOrder.setY(_mainPlayer.y-y)
            playerToOrder.setState('onAir')
            this.grabUp = true
        }
        else if (this.cursors?.space.isUp && playerToOrder.state === 'onAir' && this.playerToOrderMainPlayerCollider) {
            this.playerToOrderMainPlayerCollider.active = false
            playerToOrder.play(`${name}_stand`).setSize(x, y)
            playerToOrder.setBounce(0.1)
            playerToOrder.setState('onGround')
            this.grabUp = false
        } else if(_mainPlayer.state === 'falling'){
            playerToOrder.play(`${name}_stand`).setSize(x, y)
            playerToOrder.setBounce(0.1)
            playerToOrder.setState('onGround')
            this.grabUp = false
        }
        return
    }
    
    handleDeathFall(_player:Phaser.Physics.Arcade.Sprite): void {
        this.lifes = 0

        _player.setState('falling')
        _player.setVelocityY(-10)
        _player.setTint(0xff0000)
    
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.start('menu')
                }, 
            loop: false
        })
    }
}