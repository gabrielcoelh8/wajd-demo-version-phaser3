/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import short from 'short-uuid'

interface IState
{
	name: string
	onEnter?: () => void
	onUpdate?: (dt: number) => void
	onExit?: () => void
}

export default class StateMachine
{
    private id!: string
	private context?: object
	private states = new Map<string, IState>()
	private currentState?: IState
    private isChangingState = false
    changeStateQueue: string[] = []

    constructor(context?:object, _id?: string) {
        this.id = _id ?? short.generate()
        this.context = context
    }
    
    isCurrentState(name: string)
	{
		if (!this.currentState)
		{return false}

		return this.currentState.name === name
	}

	addState(
        name: string, 
        config?: { 
            onEnter?: () => void, 
            onUpdate?: (dt: number) => void, 
            onExit?: () => void })
	{
        const context = this.context
	
        this.states.set(name, {
            name,
            onEnter: config?.onEnter?.bind(context),
            onUpdate: config?.onUpdate?.bind(context),
            onExit: config?.onExit?.bind(context)
        })
    
        return this
	}

	setState(name: string)
	{
        if (!this.states.has(name))
        {
            console.warn(`Tried to change to unknown state: ${name}`)
            return
        }

        if (this.isCurrentState(name))
        {
            return
        }

        if (this.isChangingState)
        {
            this.changeStateQueue.push(name)
            return
        }

        this.isChangingState = true

        console.log(`[StateMachine (${this.id})] change from ${this.currentState?.name ?? 'none'} to ${name}`)

        if (this.currentState && this.currentState.onExit)
        {
            this.currentState.onExit()
        }
    
        this.currentState = this.states.get(name)!
    
        if (this.currentState.onEnter)
        {
            this.currentState.onEnter()
        }
    
        this.isChangingState = false
	}

	update(dt: number)
	{
        if (this.changeStateQueue.length > 0)
        {
            this.setState(this.changeStateQueue.shift()!)
            return
        }
    
        if (this.currentState && this.currentState.onUpdate)
        {
            this.currentState.onUpdate(dt)
        }
	}
}