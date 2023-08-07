import Phaser from 'phaser'

export default class Preload extends Phaser.Scene {
    private bg?: Phaser.GameObjects.TileSprite

    constructor() {
		super()
    }
    
    preload() {
        this.load.image('bg', 'assets/background/bg_desert.png')
        this.load.bitmapFont('ice', 'assets/UI/bitmaps/iceicebaby.png', 'assets/UI/bitmaps/iceicebaby.xml');
    }

    create() {
        this.bg = this.add.tileSprite(this.scale.width/2, this.scale.height, this.scale.width, this.scale.height,'bg').setScale(2) //background
        this.add.dynamicBitmapText(180, 700, 'ice', 'Aperte qualquer tecla para iniciar', 50).setScale(0.7)

        const tintedText = this.add.dynamicBitmapText(270, 64, 'ice', '- WAJD -', 128); 
        tintedText.setScale(0.7)

        this.input.keyboard?.on('keydown', () => {
            this.scene.start('easy')
        })
    }

    update() {
        if(!this.bg) {
            return
        }

        this.bg.tilePositionX -= 1;
    }

}