import { Instance, types } from 'mobx-state-tree';

export enum ISliderState {
  archive = 'archive',
  live = 'live',
  draft = 'draft'
}

export interface IAppSettings {
  isManualScanChecked?: boolean;
  labelId?: string;
  expandDetailsOnLoad?:boolean
}

export interface ISliderSettings {
  expandDetailsOnLoad:boolean
}

// export interface SingleSliderModel {
//   mainTxt: string,
//   secondary: string | null
//   date: Date | null
//   id: string
//   img: string | null
//   detailPreview: string | null
//   currentEditState: SliderState
//   initExpandAll: false
// }

export interface SingleSlideModel {
  mainTxt:string
  secondary: string
  detailPreview: string | null
  date?:Date | null
  id:string
  img?:string | null
  currentEditState: ISliderState
  initExpandAll?: boolean
  show?:()=>void
}

export interface ISliderImagesModel {
  b64: string,
  imgId: string,
  slideId: string
}