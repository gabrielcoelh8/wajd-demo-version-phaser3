/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import Phaser from "phaser";
import { IComponent } from "../system/ComponentService";

export default class PlayerPhysics implements IComponent {
    private gameObject!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

    constructor() 
    {
    }

    init(entity: Phaser.GameObjects.GameObject)
    {
        this.gameObject = entity as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
        this.gameObject.setDepth(1)
        this.gameObject.setBounce(0.1)
        this.gameObject.setSize(50, 90)
        this.gameObject.setCollideWorldBounds(true)
    }
}