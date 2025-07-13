import { action, makeAutoObservable } from "mobx"
import { RootStore } from "../RootStore/SearchRootStore"

export class TopBarViewStore {
    root:RootStore
    searchTabValue = 1
    constructor(root:RootStore){
        this.root = root
        makeAutoObservable(this)
    }

    setSearchTabValue = action((val: number) => {
        this.searchTabValue = val
    })

    changeTabValue = action((event: React.SyntheticEvent, newValue: number) => {
        this.setSearchTabValue(newValue)
      })
}