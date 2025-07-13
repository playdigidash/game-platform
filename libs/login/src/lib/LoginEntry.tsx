import { ICurrentUserModel } from "@lidvizion/commonlib"
import { observer } from "mobx-react"
import { useNavigate } from "react-router-dom"
import { Login } from "./Login/Login"
import { RootStoreProvider } from "./RootStore/RootStoreProvider"

interface ILoginEntry {
    handleAfterSignUp:(
        isOptInChecked:boolean, 
        email:string
    )=> void
    handleAfterLogin:(realmUser?: Realm.User | null)=> void
    currUser:ICurrentUserModel | null
    loginOnly:boolean
    redirectPath?:string
}

export const LoginEntry:React.FC<ILoginEntry> = observer(({
    handleAfterSignUp,
    currUser,
    loginOnly,
    handleAfterLogin,
    redirectPath
})=>{
    return (
        <RootStoreProvider>
            <Login
            redirectPath={redirectPath}
            loginOnly={loginOnly}
            handleAfterSignUp={handleAfterSignUp}
            handleAfterLogin={handleAfterLogin} // DIRECT PASS OF FUNCTIOn
            currUser={currUser}
          />
        </RootStoreProvider>
    )
})