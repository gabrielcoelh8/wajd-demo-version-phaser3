/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import Phaser from "phaser";
import { IComponent } from "../system/ComponentService";
import StateMachine from "../system/StateMachine";

export default class PlayerMovement implements IComponent {
    private readonly speed!: number
    private gameObject!: Phaser.Physics.Arcade.Sprite
    private movementMachine: StateMachine
    private delta!: number
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys

    constructor(cursors: Phaser.Types.Input.Keyboard.CursorKeys, speed = 100) 
    {
        this.cursors = cursors
        this.speed = speed
        this.movementMachine = new StateMachine(this, 'PlayerMovement')
    }

    init(entity: Phaser.GameObjects.GameObject)
    {
        this.gameObject = entity as Phaser.Physics.Arcade.Sprite

        //states
        this.movementMachine
            .addState('idle', {
                onEnter: this.onIdle,
                onUpdate: this.updateState
            })
			.addState('move', {
				onEnter: this.onMove,
                onUpdate: this.updateState
			}
        )
        //default state
        this.movementMachine.setState('idle') 
    }

    update(delta: number)
    {
        this.delta = delta
        this.movementMachine.update(this.delta) //calls updateState()
    }

    updateState() {
        const { up, left, right } = this.cursors

        if( up.isDown || left.isDown || right.isDown ){
            this.movementMachine.setState('move')
        } else {
            this.movementMachine.setState('idle')
        }
    }

    /*
    state functions
    */

    onIdle() { //idle state
        this.gameObject.setVelocityX(0)
        this.gameObject.setVelocityY(0)
    }

    onMove() { //on movement state
        const { up, left, right } = this.cursors  ///, shift, space

        if(left.isDown) {
            this.gameObject.setVelocityX(-this.speed)
            this.gameObject.setVelocityY(0)
        }
        else if(right.isDown) {
            this.gameObject.setVelocityX(this.speed)
            this.gameObject.setVelocityY(0)
        }

        if(up.isDown && this.gameObject.body?.blocked.down) {
            this.gameObject.setVelocityY(-250)
        }
    }

}