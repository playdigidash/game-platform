import { ICurrentMaterial, ICustomerStreamsModel } from "./MaterialModel";
import { SingleSlideModel } from "./SingleSliderModel";

export interface ICurrentCustomerModel {
    slides: SingleSlideModel[];
    videos: IVideoModel[];
    quizUrls: IQuizModel[];
    accepted: ICurrentMaterial[];
    state: string;
    _id: string;
    _partition: string;
    phone: number | null;
    email: string;
    resources: ICustomerResourceModel[];
    entityName: string;
    dropLocations: IDropLocation[];
    county: string;
    funFacts: string[];
    calendarId: string;
    id: string;
    isScanOn: boolean;
    locations: string[];
    chatbot: IChatbotModel;
    streams?: ICustomerStreamsModel[];
    logos?: {
      leftMenu:string,
      rightMenu:string,
      scanLogo:string,
      loadLogo:string
    },
    dashboardSettings?:{
        expandDetailsOnLoad?:boolean
        isManualScanChecked?:boolean
        labelId?:string
    }
  }
export interface IVideoModel {
    title?:string
    youtubeEmbed: string
}

export interface IChatbotModel {
    embed: string
}

export interface IQuizModel {
    url: string
    title?: string
}

export interface ICustomerResourceModel {
    title: string,
    src: string,   
}

export interface IDropLocation {
    locationId:string,
    description?: string
}
export interface ISocialLink {
    type: string;
    url: string;
    title?: string;
    visible?: boolean;
    order?: number;
}
  
export interface IPageModel {
    pageId: string;
    pageTitle: string;
    handle: string;
    bio?: string;
    orgId: string;
    pageImg?: string; // Profile image
    bannerImg?: string;
    pendingVerification: boolean;
    verified: boolean;
    visibility?: 'public' | 'private' | string;
    modules: string[];
    featuredModuleIds?: string[];
    socialLinks?: ISocialLink[];
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
  }