/* eslint-disable @typescript-eslint/no-empty-function */
import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {
    
    constructor() {
		super('preload')
	}

    preload() {
        this.load.image('bg', 'assets/background/bg_desert.png')
        this.load.bitmapFont('ice', 'assets/UI/bitmaps/iceicebaby.png', 'assets/UI/bitmaps/iceicebaby.xml');
        this.load.atlasXML('alienBeige', 'assets/atlas/aliens/alienBeige.png', 'assets/atlas/aliens/alienBeige.xml')
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
            this.scene.switch('first-scene')
        })

         //animações TODO CONSERTAR BUG
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
    }

    update() {
        
    }

}