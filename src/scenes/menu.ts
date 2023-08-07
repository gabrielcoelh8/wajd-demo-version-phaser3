import Phaser from 'phaser'

export default class Preload extends Phaser.Scene {
    private bg!: Phaser.GameObjects.TileSprite
    private fog!: Phaser.GameObjects.TileSprite
    private foreground!: Phaser.GameObjects.TileSprite
    private tree!: Phaser.GameObjects.TileSprite

    constructor() {
		super()
    }
    
    preload() {
        this.load.atlas('parallax', 'assets/background/parallax/v1/parallax.png', 'assets/background/parallax/v1/parallax.json')
        this.load.bitmapFont('ice', 'assets/UI/bitmaps/iceicebaby.png', 'assets/UI/bitmaps/iceicebaby.xml');
    }

    create() {
        this.bg = this.add.tileSprite(0, 300, this.scale.width, 208,'parallax', 'background.png') //background
        this.fog = this.add.tileSprite(0, 460, this.scale.width, 208,'parallax', 'fog.png')
        this.foreground = this.add.tileSprite(0, 440, this.scale.width, 208,'parallax', 'foreground.png')
        this.tree = this.add.tileSprite(0, 310, this.scale.width, 208,'parallax', 'trees.png')

        this.bg.setScale(3).setDepth(-4)
        this.tree.setScale(3).setDepth(-3)
        this.foreground.setScale(3.2).setDepth(-2)
        this.fog.setScale(3).setDepth(-1)

        this.add.dynamicBitmapText(180, 700, 'ice', 'Aperte qualquer tecla para iniciar', 50).setScale(0.7)
        const tintedText = this.add.dynamicBitmapText(270, 64, 'ice', '- WAJD -', 128); 
        tintedText.setScale(0.7).setDepth(-3.5)

        this.input.keyboard?.on('keydown', () => {
            this.scene.start('easy')
        })
    }

    update() {
        this.bg.tilePositionX -= 0.4;
        this.tree.tilePositionX -= 0.5;
        this.foreground.tilePositionX -= 0.6 ;
        this.fog.tilePositionX -= 0.3;
    }

}