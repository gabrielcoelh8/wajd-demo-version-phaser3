/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import Phaser from "phaser";
import { IComponent } from "../system/ComponentService";

export default class PlayerCollision implements IComponent {
    private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    private collisionObject: Phaser.GameObjects.GameObject
    private scenePhysics: Phaser.Physics.Arcade.ArcadePhysics

    constructor(collisionObject: Phaser.GameObjects.GameObject, scenePhysics: Phaser.Physics.Arcade.ArcadePhysics) 
    {   
        this.collisionObject = collisionObject
        this.scenePhysics = scenePhysics
    }

    init(entity: Phaser.GameObjects.GameObject)
    {
        this.player = entity as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
        this.scenePhysics.add.collider(this.player, this.collisionObject)
    }

    update(_delta: number)
    {
    }

}