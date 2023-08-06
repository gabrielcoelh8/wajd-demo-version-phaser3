import Phaser from 'phaser'

export default class Preload extends Phaser.Scene {

    constructor() {
		super()
    }
    
    preload() {
        this.load.image('bg', 'assets/background/bg_desert.png')
        this.load.bitmapFont('ice', 'assets/UI/bitmaps/iceicebaby.png', 'assets/UI/bitmaps/iceicebaby.xml');
    }

    create() {
        this.add.image(this.scale.width/2, this.scale.height/2,'bg').setScale(1.5) //background
        this.add.dynamicBitmapText(180, 700, 'ice', 'Aperte qualquer tecla para iniciar', 50).setScale(0.7)

        const tintedText = this.add.dynamicBitmapText(270, 64, 'ice', '- WAJD -', 128); 
        tintedText.setScale(0.7)

        this.input.keyboard?.on('keydown', () => {
            this.scene.start('easy')
        })       
    }

    update() {
        ///TODO: parallaxcanvas
    }

}