import { TopBarViewStore } from "../top-bar/TopBarViewStore"
import { SearchViewStore } from "../view/SearchViewStore"

export class RootStore {
    topBarViewStore:TopBarViewStore
    searchViewStore:SearchViewStore

    constructor() {
       this.topBarViewStore = new TopBarViewStore(this)
       this.searchViewStore = new SearchViewStore(this)
    }
}