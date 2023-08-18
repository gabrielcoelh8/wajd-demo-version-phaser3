/* eslint-disable @typescript-eslint/no-unused-vars */
import Phaser from "phaser";
import { IComponent } from "../system/ComponentService";

type AnimationData = {
    left: {key: string, flip?: boolean},
    right: {key: string, flip?: boolean},
    up: {key: string, flip?: boolean},
    down: {key: string, flip?: boolean},
    idle: {key: string, flip?: boolean}
}

export default class PlayerAnims implements IComponent {
    private readonly cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private readonly data!: AnimationData
    private gameObject!: Phaser.Physics.Arcade.Sprite
    
    constructor(cursors:Phaser.Types.Input.Keyboard.CursorKeys, data: AnimationData){
        this.cursors = cursors
        this.data = data
    }

    init(go: Phaser.GameObjects.GameObject) {
        this.gameObject = go as Phaser.Physics.Arcade.Sprite
    }

    update(_delta: number) {
        if(this.cursors.left.isDown) {
            const { key, flip } = this.data.left
            
            this.gameObject.play(key)
            this.gameObject.setFlipX(!!flip)
        } else {
            const direction = this.gameObject.anims.currentAnim?.key.split('-')[1] 
            //get direction based on anims key fixes
            this.gameObject.play(`${this.data.idle.key}-${direction}`, true) 
            //play anims idle for specify direction
        }
    }
}