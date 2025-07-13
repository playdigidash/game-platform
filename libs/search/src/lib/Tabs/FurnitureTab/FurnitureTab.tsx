import { observer } from "mobx-react";
import { ISearchTab } from "../../search";
import { AccordionSkeleton } from "../AccordionSkeleton";

export const FurnitureTab:React.FC<ISearchTab> = observer(({
    items,
    onChildClickHandler,
    tabName
})=>{
    return (
        <AccordionSkeleton  
            onChildClickHandler={onChildClickHandler} 
            recyclables={items}
            tabName={tabName}
        />
    )
})