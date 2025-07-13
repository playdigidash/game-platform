/// <reference types="react" />
import { CalendarEventModel } from '@lidvizion/commonlib';
interface IColorPickerModal {
    showColorPickerModal: boolean;
    currentEvent: CalendarEventModel;
    setShowColorPickerModal: (bool: boolean) => void;
}
export declare const ColorPickerModal: React.FC<IColorPickerModal>;
export {};
