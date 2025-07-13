export interface IMaterialStream {
  streamName: string,
  types: IMaterialType[],
}

export interface IMaterialType {
  id: string,
  typeCusName: string,
  typeCusSvg: string,
  typeCusSvgId: string,
  typeFunFact: string,
  typeMsg: string,
  defaults: IDefaultMaterialType,
  items: any[]
}

export interface IDefaultMaterialType {
  _id: string,
  donts: string[],
  dos: string[],
  fixable: [
    string,
    { fixableMsg: string }
  ],
  type: {
    typeName: string,
    typeId: string,
    typeSvgFileName: string,
    typeSvgId: string,
  }
}

export interface ICustomerMaterialItem {
  _id: string
  item: {
    itemId: string,
    itemNameCusOvr: string,
    itemTypeCusOvr: string,
  },
  cusSvg: {
    svgId: string
    cusFilename: string
  },
  donts: [
    string,
    { dontMsgOvr: string }
  ],
  dos: [
    string,
    { doMsgOvr: string }
  ],
  fixable: [
    string,
    { fixableMsgOvr: string }
  ],
  organizationId: string,
  funFactsOvr: string[]
}

