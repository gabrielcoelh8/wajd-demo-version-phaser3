/* eslint-disable @typescript-eslint/no-unused-vars */
import Phaser, { GameObjects } from "phaser";
import PlayerCollision from "../../component/PlayerCollision";
import PlayerMovement from "../../component/PlayerMovement";
import PlayerPhysics from "../../component/PlayerPhysics";
import PlayerTexture from "../../component/PlayerTexture";
import ComponentService from "../../system/ComponentService";
import Health from '../../system/HealthSystem'
import short from 'short-uuid'

export default class Easy extends Phaser.Scene {
    //private CHAR_GRAVITY = 300;

    private MAIN_CHAR_KEY = 'alienBeige'

    //private platforms?: Phaser.Physics.Arcade.StaticGroup

    //private numbersToOrder?: Phaser.Physics.Arcade.Group

    //private playersToOrder?: Phaser.Physics.Arcade.Group
    
    private playerPlatform_Collider?: Phaser.Physics.Arcade.Collider

    //private playerToOrderPlatformCollider?: Phaser.Physics.Arcade.Collider

	private player!: Phaser.GameObjects.GameObject

	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    private labels?: Phaser.GameObjects.Text

    private playerToOrderMainPlayerCollider?: Phaser.Physics.Arcade.Collider

    private playerUp?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

    private lifes: integer = 0

    private grabUp = false

    //private background!: Phaser.GameObjects.TileSprite

    private farBuildings!: Phaser.GameObjects.TileSprite

    private buildings!: Phaser.GameObjects.TileSprite

    private foreground!: Phaser.GameObjects.TileSprite

    private zoneOfDeath!: Phaser.GameObjects.Zone

    private camera!: Phaser.Cameras.Scene2D.Camera
    
    #health: Health;
    
    #componentService!: ComponentService
    
    constructor(health: Health) {
        super()
        this.#health = health
        this.#componentService = new ComponentService()
    }

    preload(): void {
        //local assets
        this.load.atlas('parallax2', 'assets/background/parallax/v2/parallax.png', 'assets/background/parallax/v2/parallax.json')
        this.load.image('bg_alt', 'assets/background/parallax/v2/bg_alt.png')
    }


    create(): void {
        this.#health.init()
        const { width, height } = this.scale

        const point_x = -500
        const point_y = 400

        
        this.physics.world.setBounds(0, 0, width, height+200, false, false, true, true) ///collision only on down
        
       // const player = this.physics.add.sprite(point_x, point_y-80, this.MAIN_CHAR_KEY)
        const platforms = this.physics.add.staticGroup()
        const playersToOrder = this.physics.add.group()
        const numbersToOrder = this.physics.add.staticGroup()
        const filter = this.make.renderTexture({
            width: width*2,
            height: height*2, 
            x: 0,
            y: height/2
        }, true)
        const numberOfVariables = 4
        const numeros = Array.from({ length: numberOfVariables }, (_, index) => index) //array de 0 ao tamanho da variável acima
        const numerosAleatorios = this.shuffleNumeros(numeros)
        const alienColors = [
            /*'Beige', */
            'Blue', 
            'Green', 
            'Yellow', 
            'Pink'
        ]
        let alienKeys = Array.from({ length: alienColors.length }, (_, index) => index)
        /*
        sprites configuration
        */
        //this.background = this.add.tileSprite(0, GAME.HEIGHT/2, GAME.WIDTH*2, GAME.HEIGHT, 'bg_alt').setScale(1)  ////'parallax2', 'skill-desc_0003_bg.png'
        this.farBuildings = this.add.tileSprite(0, 0, width, 142, 'parallax2', 'skill-desc_0002_far-buildings.png').setScale(3)
        this.buildings = this.add.tileSprite(0, 0, width, 142, 'parallax2', 'skill-desc_0001_buildings.png').setScale(3)
        this.foreground = this.add.tileSprite(0, 0, width, 142, 'parallax2', 'skill-desc_0000_foreground.png').setScale(3) 
        
        //initial position
        this.farBuildings.setY(550)
        this.buildings.setY(750)
        this.foreground.setY(900)

        //this.background.setDepth(-3)
        this.farBuildings.setDepth(-2)
        this.buildings.setDepth(-1) 
        this.foreground.setDepth(1)
        
        filter.fill(276558, 0.2)
        filter.setDepth(2) 
        /*
        plataforma auxiliar
        */
        const aux_plat = platforms.create(point_x, point_y, 'tiles', 'stoneCenter_rounded.png')
        /*
        vidas label TODO: HEART
        */
        this.labels = this.add.text(10, 500, "").setScrollFactor(0)
        this.labels.setShadow(1, 1, '#000000', 2)
        this.labels.setDepth(3)

        this.input.on(Phaser.Input.Events.POINTER_DOWN as string,  
            () => {
            this.#health.loseHealth()
        }, this)

        /*
        platform and alien to order
        */
        alienKeys = this.shuffleNumeros(alienKeys)  //cor aleatoria
        for (let i = 0; i < numberOfVariables; i++) {
            const x = (-200+(i*140))
            const y = 550
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
    //    this.playerPlatform_Collider = this.physics.add.collider(player, platforms)
        
      /*  playersToOrder.getChildren().forEach((playerToOrder)=>{
            const _playerToOrder = playerToOrder as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
            const numberOf = _playerToOrder.data.get('number') as number

            this.physics.add.collider(_playerToOrder, platforms)
            this.physics.add.overlap(player, playerToOrder, () => this.handleOverlapUp(player, _playerToOrder, numberOf))
            }
        )*/
        
        
        //this.zoneOfDeath = this.add.zone(0, height+250, width*2, 800)
       // this.physics.add.existing(this.zoneOfDeath, true)
        //this.physics.add.overlap(player, this.zoneOfDeath, () => this.//handleDeathFall(player))
        
        /*
        camera
        */
        if(!this.input.keyboard) {
            return
        }
        this.cursors = this.input.keyboard.createCursorKeys()
        
        const playerMovement = new PlayerMovement(this.cursors)
        const playerTexture = new PlayerTexture(this.MAIN_CHAR_KEY, point_x, point_y, this.physics)
        const playerCollision = new PlayerCollision(aux_plat, this.physics)
        const playerPhysics = new PlayerPhysics()

        this.player = new Phaser.GameObjects.GameObject(this, 'SpriteWithDynamicBody')

        //components
        this.#componentService.addComponent(this.player, playerTexture)
        this.#componentService.addComponent(this.player, playerMovement)
        this.#componentService.addComponent(this.player, playerCollision)
        this.#componentService.addComponent(this.player, playerPhysics)

        this.camera = this.cameras.main
        this.cameras.main.startFollow(this.player, true, 0.5, 0.5)
    }

    update(time: number, delta: number): void {
        /////////////////////
        this.labels?.setText(
        `{Debug} 
        lifes:${this.#health.currentHealth}
        camera.x: ${this.cameras.main.scrollX}
        camera.y: ${this.cameras.main.scrollY}
        player_state: ${this.player.state}
        grabUp: ${this.grabUp}
        player_velocityX: ${this.player.body?.velocity.x}
        player_velocityY: ${this.player.body?.velocity.y}
        time: ${time}
        delta: ${delta}
        `)
        ///////////////////

        this.lifes = this.#health.currentHealth

        this.#componentService.update(delta)
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
        const y = 90
        
        if (this.cursors?.space.isDown && playerToOrder.state === 'onGround' && this.grabUp == false && _mainPlayer.state!=='falling') {
            this.playerUp = playerToOrder
            this.playerToOrderMainPlayerCollider = this.physics.add.collider(playerToOrder,_mainPlayer)
            playerToOrder.play(`${name}_mini`).setSize(54, 54)
            playerToOrder.setBounce(0)
            playerToOrder.setY(playerToOrder.y-74) //REDO
            playerToOrder.setState('onAir')
            this.grabUp = true
        }
        else if (this.cursors?.space.isUp && playerToOrder.state === 'onAir' && this.playerToOrderMainPlayerCollider) {
            this.playerToOrderMainPlayerCollider.active = false
            playerToOrder.play(`${name}_stand`).setSize(x, y)
            playerToOrder.setBounce(0.1)
            playerToOrder.setState('onGround')
            this.grabUp = false
        } 
        else if (_mainPlayer.state === 'falling'){
            playerToOrder.play(`${name}_stand`).setSize(x, y)
            playerToOrder.setBounce(0.1)
            playerToOrder.setState('onGround')
            this.grabUp = false
        }

        return
    }
    
    handleDeathFall(_player:Phaser.Physics.Arcade.Sprite): void {
        this.grabUp = false

        _player.setAlpha(0.5)

        /*
        if (this.#health.currentHealth > 0) {
            this.time.addEvent({
                delay: 100,
                callback: () => {
                    this.#health.loseHealth()
                    },
                loop: true
            })
        }

        if(this.#health.currentHealth == 0) {
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.scene.pause('health_ui')
                    this.scene.start('menu')
                    },
                loop: false
            })
        }*/
    }
}