import { AlertModel } from "./AlertModel"

export enum RecurringTime {
    Daily = 'Daily',
    Monthly = 'Monthly',
    Weekly = 'Weekly',
    Once = 'Once'
}

export enum CalendarEventStatus {
    canceled = 'canceled',
    active = 'active'
}


export interface CalendarEventModel {
    title?:string
    detail?: string
    timeStart?: Date | null
    timeEnd?: Date | null
    recurring?: RecurringTime
    color?: string
    eventId: string
    calendarId: string
    isAllDay?: boolean
    alert?: AlertModel | null
    status: CalendarEventStatus
    isHoliday:boolean
    year?:number
}