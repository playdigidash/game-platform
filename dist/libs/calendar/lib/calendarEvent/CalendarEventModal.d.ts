import React from 'react';
import { CalendarEventModel } from '@lidvizion/commonlib';
interface ICalendarEventModal {
    showEventDetailModal: boolean;
    currentEvent: CalendarEventModel | null;
    setShowEventDetailModal: (bool: boolean) => void;
}
export declare const CalendarEventModal: React.FC<ICalendarEventModal>;
export {};
