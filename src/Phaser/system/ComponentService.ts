/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
import Phaser from "phaser";
import short from 'short-uuid'

export type Constructor<T extends {} = {}> = new (...args: any[]) => T

export interface IComponent {
    init(entity: Phaser.GameObjects.GameObject):any

    awake?: () => void
    start?: () => void
    update?: (dt:number) => void
    destroy?: () => void
}

export default class ComponentService {
    private componentsByEntity = new Map<string, IComponent[]>()
    private queuedForStart: IComponent[] = []

    addComponent(entity: Phaser.GameObjects.GameObject, component: IComponent) {
        //gameobject unique name (name property is used here for id generated with short-uuid)
        if(!entity.name) {
            entity.name = short.generate()
            console.log(entity.name)
        }
        //init list of components for gameobject if there's not any
        if(!this.componentsByEntity.has(entity.name)) {
            this.componentsByEntity.set(entity.name, [])
        }
        const list = this.componentsByEntity.get(entity.name) as IComponent[]
        list.push(component)

        //lifecycle hooks
        component.init(entity)

        if(component.awake)
        {
            component.awake()
        }

        if(component.start)
        {
            this.queuedForStart.push(component)
        }
    }

    findComponent<ComponentType extends {}>(entity: Phaser.GameObjects.GameObject, componentType: Constructor<ComponentType>){
        const components = this.componentsByEntity.get(entity.name)
        if(!components) 
        {
            return null
        }
        return components.find(_component => _component instanceof componentType)
    }

    destroy() { 
        const entries = this.componentsByEntity.entries() //get map of components 
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
        const entries = this.componentsByEntity.entries() //get map of components 
        for (const [, components] of entries) {
            components.forEach(component => {
                if(component.update) {
                    component.update(dt)
                }
            })
        }
    }
}