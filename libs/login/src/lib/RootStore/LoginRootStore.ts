import { LoginViewStore } from "../Login/LoginViewStore"
import { SnackbarViewStore } from "../Snackbar/SnackbarViewStore"

export class RootStore {
    loginViewStore:LoginViewStore
    snackbarViewStore:SnackbarViewStore

    constructor() {
       this.loginViewStore = new LoginViewStore(this)
       this.snackbarViewStore = new SnackbarViewStore(this)
    }
}