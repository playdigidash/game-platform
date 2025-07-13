import { CalendarViewStore } from "../calendarEvent/CalendarViewStore"

export class RootStore {
    calendarViewStore:CalendarViewStore
   
    constructor() {
       this.calendarViewStore = new CalendarViewStore(this)
    }
}