/// <reference types="react" />
import { IMaterialType } from '@lidvizion/commonlib';
interface IAccordionSkeleton {
    recyclableTypes?: IMaterialType[];
    recyclables?: any[];
    onChildClickHandler: (item: any) => void;
    tabName: string;
}
export declare const AccordionSkeleton: React.FC<IAccordionSkeleton>;
export {};
