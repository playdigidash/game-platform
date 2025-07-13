export enum AlertType {
    AllUsers = 'All Users',
    Off = "Off"
}

export interface AlertModel{
    alertType:AlertType
    msg: string
    subject: string
}
