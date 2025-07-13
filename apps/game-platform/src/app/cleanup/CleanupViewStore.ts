import { RootStore } from "../RootStore/RootStore";
import * as CANNON from 'cannon-es';

export class CleanupViewStore {
    root:RootStore
    removableItsmQueue:CANNON.Body[] = []
    constructor(root:RootStore) {
        this.root = root
    }

    addRemovableItem = (item:CANNON.Body) => {
        this.removableItsmQueue.push(item)
    }

    removeItemsFromWorld = () => {
        this.removableItsmQueue.forEach((item)=>{
            this.root.mainSceneViewStore.cannonWorld.removeBody(item)
        })
        this.removableItsmQueue = []
    }
}