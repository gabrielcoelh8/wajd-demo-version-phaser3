interface IState
{
	name: string
	onEnter?: () => void
	onUpdate?: (dt: number) => void
	onExit?: () => void
}

export default class StateMachine
{
	private states = new Map<string, IState>()
	private currentState?: IState

	addState(name: string, config?: { onEnter?: () => void, onUpdate?: (dt: number) => void, onExit?: () => void })
	{
		// add a new State
	}

	setState(name: string)
	{

		// switch to State called `name`
	}

	update(dt: number)
	{
		// update current state if exists
	}
}