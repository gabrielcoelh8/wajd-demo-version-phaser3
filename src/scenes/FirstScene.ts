/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import Phaser from 'phaser'

export default class Preload extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup
	private player?: Phaser.Physics.Arcade.Sprite
	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private ground?: Phaser.GameObjects.TileSprite
    private PlayerPlatformsCollider?: Phaser.Physics.Arcade.Collider
    private labels?: Phaser.GameObjects.Text
    //private scoreText?: Phaser.GameObjects.Text
    private lifes:integer = 7
    //private score:integer = 0

    constructor() {
		super('first-scene')
    }
    
    preload() {
        this.load.image('bgCastle', 'assets/background/bg_castle.png')
        this.load.image('bgDesert', 'assets/background/bg_desert.png')
        this.load.image('bgGrasslands', 'assets/background/bg_grasslands.png')

        this.load.atlasXML('alienPink', 'assets/atlas/aliens/alienPink.png', 'assets/atlas/aliens/alienPink.xml')
        this.load.atlasXML('alienGreen', 'assets/atlas/aliens/alienGreen.png', 'assets/atlas/aliens/alienGreen.xml')
        this.load.atlasXML('alienBlue', 'assets/atlas/aliens/alienBlue.png', 'assets/atlas/aliens/alienBlue.xml')
        this.load.atlasXML('alienYellow', 'assets/atlas/aliens/alienYellow.png', 'assets/atlas/aliens/alienYellow.xml')

        this.load.image('grass', 'assets/ambient/grass/grass.png')
        this.load.image('lava', 'assets/ambient/lava/liquidLava.png')
        this.load.image('lavaTop', 'assets/ambient/lava/liquidLavaTop.png')
        this.load.atlas('number', 'assets/UI/numbers/numbers.png', 'assets/UI/numbers/numbers.json')
    }


    create() {
        this.lifes = 7;
        //this.score = 0;
        this.player = undefined;
        this.cursors = undefined;
        //this.scoreText = undefined;
        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
        this.cursors = this.input.keyboard?.createCursorKeys()

        //tiles
        this.add.image(this.scale.width/2, this.scale.height/2,'bgGrasslands').setScale(1.5) //background

        this.add.tileSprite(this.scale.width/2, this.scale.height-170, this.scale.width, 70, 'lavaTop').setScale(1).setName('lavaTop')  //superficie da lava
        this.ground = this.add.tileSprite(this.scale.width/2, this.scale.height-70, this.scale.width, 140, 'lava').setScale(1).setName('lavaLiquid') //corpo da lava
        this.physics.add.existing(this.ground, true)
        
        //plataformas
        this.platforms = this.physics.add.staticGroup()
        this.platforms.create(100, 250, 'grass')
        this.player = this.physics.add.sprite(100, 160, 'alienBeige')
        this.player.setBounce(0.1)
        this.player.setSize(50, 90)
        this.player.setCollideWorldBounds(true)
        this.PlayerPlatformsCollider = this.physics.add.collider(this.player, this.platforms)
        
        //overlap com ground
        const p1 = this.player
        this.physics.add.overlap(p1, this.ground, () => this.handleDeathLava(p1))
        
        //score
        this.labels = this.add.text(10, 10, `Life: ${this.lifes}`).setScrollFactor(0);
        this.labels.setShadow(1, 1, '#000000', 2);

        //numeros aleatorios
        const numberOfVariables = 7
        const numeros = Array.from({ length: numberOfVariables }, (_, index) => index);
        const numerosAleatorios = this.shuffleNumeros(numeros);

        //cor do alien
        const alienColors = [
            /*'Beige', */
            'Blue', 
            'Green', 
            'Yellow', 
            'Pink'
        ]
        let alienKeys = Array.from({ length: alienColors.length }, (_, index) => index);
        
        //criar aliens e plataformas
        for (let i = 0; i < numberOfVariables; i++) {
            const x = (380+(i*70))
            const y = 250
            alienKeys = this.shuffleNumeros(alienKeys)  //cor aleatoria

            //criação
            const platform: Phaser.Physics.Arcade.StaticGroup = this.platforms.create(x, y, 'grass')
            const playerToOrder = this.physics.add.sprite(x, y-80, `alien${alienColors[alienKeys[0]]}`, `alien${alienColors[alienKeys[0]]}_stand.png`).setName(`${i}`)
            const orderNumber = this.physics.add.sprite(playerToOrder.x, playerToOrder.y-70, 'number',`hud_${numerosAleatorios[i]}.png`)
            
            //physics
            playerToOrder.setState('')
            playerToOrder.setBounce(0.7)
            playerToOrder.setCollideWorldBounds(true)
            this.physics.add.collider(playerToOrder, platform)
            this.physics.add.collider(orderNumber, playerToOrder)
            this.physics.add.overlap(playerToOrder, this.player, () => this.handleOverlap(playerToOrder))
        }

       
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
        else if (this.cursors.down?.isDown) {
			this.player?.anims.play('duck', true)
		}
		else {
			this.player?.setVelocityX(0)
			this.player?.anims.play('turn', true)
		}

		//jump
		if((this.cursors.up?.isDown || this.cursors.space.isDown) && this.player?.body?.touching.down && this.player.state!=='morto') {
			this.player?.setVelocityY(-200)
            this.player?.anims.play('jump')
		}
        
        switch(this.player?.state) {
            case 'morto':
                this.player?.anims.play('duck', true)
                this.player.setVelocityY(150)
                this.player?.setVelocityX(0)
            break;
        }

        this.labels?.setText(`Life: ${this.lifes}`)
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
        
        if(playerToOrder.state == 'marcado') {
            this.lifes--
            playerToOrder.destroy()
            //this.player?.setState('morto')
            this.PlayerPlatformsCollider?.update() //TODO
        }
    }

    handleDeathLava(player:Phaser.Physics.Arcade.Sprite) {
        this.lifes = 0
        
        player.setState('morto')
        player.setVelocityY(0)
        player.setTint(0xff0000)


        this.time.addEvent({
            delay: 1000,
            callback: ()=>{
                this.scene.switch('preload')
            },
            loop: false
        })
    }
}