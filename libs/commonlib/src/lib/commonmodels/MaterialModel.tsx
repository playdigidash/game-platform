import { IDropLocation } from "./CurrentCustomerModel"
import { ILocation } from "./LocationModel"

export interface IScannedImgDataModel {
  b64:string
  ip: string | null
  id: string
  score: number
  bb: number[]
  class: string
}

interface IStream {
  isBulk:boolean
  isDropoff:boolean
  isRecycling:boolean
  isYard:boolean 
}

export interface IAcceptedMaterial {
  customerId: string 
  funFacts: string[]
  materialType: string
  overrideDonts: string[]
  overrideDos: string[]
  overrideFixables:string[]
  stream: IStream
}

export interface IMaterialIcon {
  name:string
  id:string
}
export interface IDonts {
  dontBlt:string
  dontMsg:string
}

export interface IDos {
  doBlt:string
  doMsg:string
}

export interface IFixable {
  fixBlt:string
  fixMsg:string
}

export interface ICurrentMaterial {
  item:string
  type?: {
    name?:string
    id?:string
    svgId?:string | null
  }
  isDropoff?:boolean
  id: string
  dos:IDos[]
  donts: IDonts[]
  dropLocations: ILocation[]
  isAccepted: boolean | null
  funFacts: string[]
  labelmap: {
    labelmaptxt: string |  null
    id: number | null
  }
  fixable: IFixable[],
  fixableMain?: string,
  doMain?: string,
  dontsMain?: string
  stream?:{
    doSvgId?:string | null
    dontSvgId?:string | null
    id:string
  }
  itemSvgId?:string | null
}
export interface ICustomerStreamTypes {
  id: string;
  locations: string[];
  typeCusName: string;
  typeCusSvg: string;
  typeCusSvgId: string;
  typeFunFact: string;
  typeMsg: string;
  customb64:string | null
}
export interface IStreamTypeItems{
  customerItem:IStreamTypeItem[]
  item:IStreamTypeItem
  labelmap:{
    labelmapId:string
    labelmaptxt:string
  }
  svg:{
    svgFilename:string
    svgId:string
  }
  typeId:string
  _id:string
}

export interface IStreamTypeItem {
  itemId:string
  itemName:string
}

export interface IDefaultType {
  fixable: IFixable[];
  dos: IDos[];
  donts: IDonts[];
  type: {
    typeName: string;
    typeId: string;
    typeSvgFileName: string;
    typeSvgId: string;
  };
}

export interface ICustomerStreamsModel {
  active: boolean;
  dropoff: boolean;
  dropLocations: IDropLocation;
  streamCusSvg: string;
  streamCusSvgDonts: string;
  streamCusSvgDontsId: string;
  streamName: string;
  types: ICustomerStreamTypes[];
  doB64:string | null
  dontB64:string | null
  streamCusSvgId:string | null
}

export interface ICustomMaterialItem {
  item: {
    connectedItems:string[],
    itemNameCusOvr?:string,
    itemTypeCusOvr?:string
  }
  cusSvg?:{
    svgId:string,
    cusFileName:string
  }
  donts:IDonts[]
  dos:IDos[]
  fixable: IFixable[]
  organizationId:string
  funFactsOvr:string[]
  id:string
}