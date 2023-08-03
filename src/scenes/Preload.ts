/* eslint-disable @typescript-eslint/no-empty-function */
import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {
    
    constructor() {
		super('preload')
	}

    preload() {
        this.load.image('bg', 'assets/background/bg_desert.png')
        this.load.bitmapFont('ice', 'assets/UI/bitmaps/iceicebaby.png', 'assets/UI/bitmaps/iceicebaby.xml');
    }

    create() {
        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

        this.add.image(this.scale.width/2, this.scale.height/2,'bg').setScale(1.5) //background
        this.add.dynamicBitmapText(180, 700, 'ice', 'Aperte qualquer tecla para iniciar', 50).setScale(0.7)
        
        //this.scene.start('first-scene')
        /* 
        this.load.on('complete', () => {
            this.scene.start('first-scene')
        })*/
        
        const tintedText = this.add.dynamicBitmapText(270, 64, 'ice', '- WAJD -', 128); 
        tintedText.setScale(0.7)

        this.input.keyboard?.on('keydown', () => {
            this.scene.start('first-scene')
        })
    }

    update() {
        
    }

}