/// <reference types="react" />
import { ICurrentUserModel } from '@lidvizion/commonlib';
export interface ISearchOption {
    label: string;
}
export interface ICalendar {
    currUser: ICurrentUserModel;
    calendarId: string;
    db: any;
    isEditable: boolean;
}
export declare const Calendar: React.FC<ICalendar>;
export default Calendar;
