export interface CalendarSearchOptionModel {
    label: string,
    recyclingDay: string,
    yardDay: string,
    trashDay: string
}

export interface RecycleSearchOotionModel {
    label:string
    id:string
}

export interface ISearchResultProps {
    svgDoB64:string | null
}