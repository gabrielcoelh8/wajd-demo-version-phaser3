/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
import Phaser from "phaser";
import short from 'short-uuid'

export type Constructor<T extends {} = {}> = new (...args: any[]) => T

export interface IComponent {
    init(go: Phaser.GameObjects.GameObject):any

    awake?: () => void
    start?: () => void
    update?: (dt:number) => void
    destroy?: () => void
}

export default class ComponentService {
    private componentsByGameObject = new Map<string, IComponent[]>()
    private queuedForStart: IComponent[] = []

    addComponent(go: Phaser.GameObjects.GameObject, component: IComponent) {
        //gameobject unique name (name property is used here for id generated with short-uuid)
        if(!go.name) {
            go.name = short.generate()
        }
        //init list of components for gameobject if there's not any
        if(!this.componentsByGameObject.has(go.name)) {
            this.componentsByGameObject.set(go.name, [])
        }
        const list = this.componentsByGameObject.get(go.name) as IComponent[]
        list.push(component)

        //lifecycle hooks
        component.init(go)

        if(component.awake)
        {
            component.awake()
        }

        if(component.start)
        {
            this.queuedForStart.push(component)
        }
    }

    findComponent<ComponentType extends {}>(go: Phaser.GameObjects.GameObject, componentType: Constructor<ComponentType>){
        const components = this.componentsByGameObject.get(go.name)
        if(!components) 
        {
            return null
        }
        return components.find(_component => components instanceof componentType)
    }

    destroy() { 
        const entries = this.componentsByGameObject.entries() //get map of components 
        for (const [, components] of entries) {
            components.forEach(component => {
                //verify if optional method is defined
                if(component.destroy) {
                    component.destroy()
                }
            })
        }
    }

    update(dt: number) {
        //start the first component of start queue
        while (this.queuedForStart.length > 0) {
            const component = this.queuedForStart.shift()

            if(component?.start) {
                component.start()
            }
        }

        //update components
        const entries = this.componentsByGameObject.entries() //get map of components 
        for (const [, components] of entries) {
            components.forEach(component => {
                if(component.update) {
                    component.update(dt)
                }
            })
        }
    }
}