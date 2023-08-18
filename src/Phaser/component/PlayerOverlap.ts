/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import Phaser from "phaser";
import { IComponent } from "../system/ComponentService";

export default class PlayerOverlap implements IComponent {
    private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

    private overlapObject: Phaser.GameObjects.GameObject
    private scenePhysics: Phaser.Physics.Arcade.ArcadePhysics

    constructor(overlapObject: Phaser.GameObjects.GameObject, scenePhysics: Phaser.Physics.Arcade.ArcadePhysics) 
    {   
        this.overlapObject = overlapObject
        this.scenePhysics = scenePhysics
    }

    init(entity: Phaser.GameObjects.GameObject)
    {
        this.player = entity as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

        this.scenePhysics.overlap(this.player, this.overlapObject, this.onOverlap)
    }

    update(_delta: number)
    {
    }

    onOverlap() {
        console.log('is overlaping...')
    }

}