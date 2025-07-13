/// <reference types="react" />
import { CalendarEventModel } from '@lidvizion/commonlib';
interface ICalendarEventDetailModal {
    showEventDetailModal: boolean;
    currentEvent: CalendarEventModel | null;
    setShowEventDetailModal: (bool: boolean) => void;
}
export declare const CalendarEventDetailModal: React.FC<ICalendarEventDetailModal>;
export {};
