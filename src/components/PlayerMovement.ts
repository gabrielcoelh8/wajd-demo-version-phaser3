/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import Phaser from "phaser";
import { IComponent } from "../util/ComponentService";

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
        if(this.cursors.left.isDown) {
            this.gameObject.setVelocityX(-this.speed)
            this.gameObject.setVelocityY(0) 
        }
    }
}