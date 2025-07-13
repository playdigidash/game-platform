import { RootStore } from "../RootStore/RootStore"

export class StageViewStore {
    root:RootStore
    currentStage = 0

    constructor(root:RootStore){
        this.root = root 
    }
}