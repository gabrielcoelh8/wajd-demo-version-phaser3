/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import Phaser from "phaser";
import { IComponent } from "../system/ComponentService";

export default class PlayerTexture implements IComponent {
    private gameObject!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    private scenePhysics: Phaser.Physics.Arcade.ArcadePhysics
    private MAIN_CHAR_KEY: string
    private xPosition: number
    private yPosition: number

    constructor(MAIN_CHAR_KEY: string, x: number, y: number, scenePhysics: Phaser.Physics.Arcade.ArcadePhysics) 
    {   
        this.scenePhysics = scenePhysics
        this.MAIN_CHAR_KEY = MAIN_CHAR_KEY
        this.xPosition = x
        this.yPosition = y
    }

    init(entity: Phaser.GameObjects.GameObject)
    {
        this.gameObject = entity as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
        //TODO ERROR
        //this.gameObject.s
        this.gameObject.setPosition(this.xPosition, this.yPosition)
        this.scenePhysics.add.existing(this.gameObject)
    }

    update(_delta: number)
    {
    }
}