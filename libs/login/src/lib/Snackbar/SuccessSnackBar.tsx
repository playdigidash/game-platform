import { Snackbar } from "@mui/material"
import { observer } from "mobx-react"
import { useLoginStore } from "../RootStore/RootStoreProvider"

export const SuccessSnackBar:React.FC = observer(()=>{
    const {
        showSuccessSnackbar,
        setShowSuccessSnackbar,
        msg
    } = useLoginStore().loginViewStore

    const handleClose = ()=> {
        setShowSuccessSnackbar(false)
    }

    return (
        <Snackbar
            open={showSuccessSnackbar}
            autoHideDuration={3000}
            onClose={handleClose}
            message={msg}
            sx={{ height: '100%' }}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'top'
            }}
        />
    )
})