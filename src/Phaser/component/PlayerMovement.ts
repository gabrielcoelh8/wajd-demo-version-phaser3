/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import Phaser from "phaser";
import { IComponent } from "../system/ComponentService";

export default class PlayerMovement implements IComponent {
    private readonly cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private readonly speed!: number
    private gameObject!: Phaser.Physics.Arcade.Sprite
    

    constructor(cursors: Phaser.Types.Input.Keyboard.CursorKeys, speed = 100) {
        this.cursors = cursors
        this.speed = speed
    }

    init(go: Phaser.GameObjects.GameObject)
    {
        this.gameObject = go as Phaser.Physics.Arcade.Sprite
    }

    update(_delta: number)
    {   
        const { up, left, down, right, shift, space } = this.cursors
        const object = this.gameObject

        if(left.isDown) {
            object.setVelocityX(-this.speed * _delta)
            object.setVelocityY(0)
        } 
        else if(right.isDown) {
            object.setVelocityX(this.speed * _delta)
            object.setVelocityY(0)
        }

        if(up.isDown && object.body?.blocked.down) {
            object.setVelocityY(-250)
        }

        //TODO: LIFT E DIED
    }
}