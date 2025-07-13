import { TextField } from "@mui/material";
import { observer } from "mobx-react";
import { useLoginStore } from "../RootStore/RootStoreProvider";


export const PasswordInput:React.FC = observer(()=>{
    const {
        isPasswordError,
        password,
        setPassword
      } = useLoginStore().loginViewStore;
      
    return (
        <TextField
              helperText={'at least 8 characters'}
              error={isPasswordError}
              id={`sign-up-password`}
              variant="standard"
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Enter password"
              type="password"
              required
            />
    )
})