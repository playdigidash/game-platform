export interface IStreamType {
    landfill: boolean
    recycling:boolean
}

export interface ILocation {
    address:string
    name:string
    locationId:string
    streamTypes:IStreamType
}