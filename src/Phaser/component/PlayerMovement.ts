/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import Phaser from "phaser";
import { IComponent } from "../system/ComponentService";
import StateMachine from "../system/StateMachine";

export default class PlayerMovement implements IComponent {
    private readonly cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private readonly speed!: number
    private gameObject!: Phaser.Physics.Arcade.Sprite
    private movementMachine: StateMachine
    private delta!: number

    constructor(cursors: Phaser.Types.Input.Keyboard.CursorKeys, speed = 100) {
        this.cursors = cursors
        this.speed = speed
        this.movementMachine = new StateMachine(this, 'PlayerMovement')
    }

    init(go: Phaser.GameObjects.GameObject)
    {
        this.gameObject = go as Phaser.Physics.Arcade.Sprite
        this.movementMachine
            .addState('idle', {
                onEnter: this.onIdle,
                onUpdate: this.listener
            })
			.addState('move', {
				onEnter: this.onMove,
                onUpdate: this.listener
			}
        )
        this.movementMachine.setState('idle')
    }

    update(_delta: number)
    {   
        this.delta = _delta
        this.movementMachine.update(this.delta)
    }

    /*
    state functions
    */
    listener() { //exit of movement state
        const { up, left, right } = this.cursors

        if( up.isDown || left.isDown || right.isDown ){
            this.movementMachine.setState('move')
        } else {
            this.movementMachine.setState('idle')
        }   
    }

    onIdle() { //idle state
        this.gameObject.setVelocityX(0)
        this.gameObject.setVelocityY(0) 
    }

    onMove() { //on movement state
        const { up, left, right } = this.cursors  ///, shift, space 
        
        if(left.isDown) {
            this.gameObject.setVelocityX(-this.speed * this.delta)
            this.gameObject.setVelocityY(0)
        } 
        else if(right.isDown) {
            this.gameObject.setVelocityX(this.speed * this.delta)
            this.gameObject.setVelocityY(0)
        }

        if(up.isDown && this.gameObject.body?.blocked.down) {
            this.gameObject.setVelocityY(-250 * this.delta)
        }
    }

}