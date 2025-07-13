/// <reference types="react" />
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import { ICalendar } from './calendar';
import './CalendarModal.css';
interface ICalendarModal extends ICalendar {
}
export declare const CalendarModal: React.FC<ICalendarModal>;
export {};
