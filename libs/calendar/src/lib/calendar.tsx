import { observer } from 'mobx-react-lite';
import { CalendarModal } from './CalendarModal';
import { ICurrentUserModel } from '@lidvizion/commonlib';
import { RootStoreProvider } from './RootStore/RootStoreProvider';

export interface ISearchOption {
  label: string
}

export interface ICalendar {
  currUser: ICurrentUserModel;
  calendarId: string;
  db:any
  isEditable:boolean
}

export const Calendar: React.FC<ICalendar> = observer(
  ({ 
    currUser,
    calendarId,
    db,
    isEditable
  }) => {
    return (
      <RootStoreProvider>
        {
           currUser && (
            <CalendarModal
              currUser={currUser}
              calendarId={calendarId}
              db={db}
              isEditable={isEditable}
            />
          )
        }
      </RootStoreProvider>
    );
  }
);

export default Calendar;
