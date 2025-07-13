import {
  CalendarEventModel,
  CalendarEventStatus,
  RecurringTime,
  CalendarSearchOptionModel
} from '@lidvizion/commonlib';
import {
  getAddySearchOptions,
  getEvents,
  CalendarTabValue,
} from '@lidvizion/commonlib';
import { action, makeAutoObservable, toJS } from 'mobx';
import { RootStore } from '../RootStore/RootStore';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localeData from 'dayjs/plugin/localeData';
import Holidays from 'date-holidays';

dayjs.extend(isSameOrBefore);
dayjs.extend(localeData);
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const defaultObserved = {
  'Thanksgiving Day': true,
  'Veterans Day': true,
  'Christmas Eve': true,
  'Christmas Day': true,
  [`New Year's Eve`]: true,
  [`New Year's Day`]: true,
  [`Martin Luther King Jr. Day`]: true,
  [`Memorial Day`]: true,
  Juneteenth: true,
  [`Independence Day`]: true,
  'Labor Day': true,
  'Columbus Day': true,
};

const currentYrHolidays = new Holidays('US').getHolidays().filter((h) => {
  //@ts-ignore
  return defaultObserved[h.name] !== undefined;
});

export class CalendarViewStore {
  root: RootStore;
  showEventModal = false;
  showCalendarModal = false;
  currentEventIdx = 0;
  currentEvent: CalendarEventModel | null = null;
  showColorPickerModal = false;
  calendarId: string | null = null;
  eventArr: CalendarEventModel[] = [];
  autocompleteRef: any = null;
  calTabValue: CalendarTabValue = CalendarTabValue.personal;
  shouldRenderDays = false;
  showEventDetailModal = false;
  searchOptions: CalendarSearchOptionModel[] = [];
  searchOptionValue = '';
  showDetailTextFieldModal = false;
  isNewEvt = false;
  calendarModalTranslatables = [''];
  calendarEventLookup = {};
  calendarEventDetailTranslatables = [''];
  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  setCalendarModalTranslatables = action((translated: string[]) => {
    this.calendarModalTranslatables = translated;
  });

  setCalendarEventDetailTranslatables = action((translated: string[]) => {
    this.calendarEventDetailTranslatables = translated;
  });

  setCalendarEventLookup = action((lookup: { [key: string]: string }) => {
    this.calendarEventLookup = lookup;
  });

  setIsNewEvt = action((bool: boolean) => {
    this.isNewEvt = bool;
  });

  setShowCalendarModal = action((bool: boolean) => {
    this.showCalendarModal = bool;
  });

  setShowEventDetailModal = action((bool: boolean) => {
    this.showEventDetailModal = bool;
  });

  setShowEventModal = action((bool: boolean) => {
    this.showEventModal = bool;
  });

  setCurrentEvent = action((evt: CalendarEventModel) => {
    this.currentEvent = evt;
  });

  setShowColorPickerModal = action((bool: boolean) => {
    this.showColorPickerModal = bool;
  });

  setCalendarId = action((str: string) => {
    this.calendarId = str;
  });

  setEventArr = action((arr: CalendarEventModel[]) => {
    this.eventArr = arr;
  });

  addEventToArr = action((evt: CalendarEventModel) => {
    this.eventArr.push(evt);
  });
  setShowDetailTextFieldModal = action((bool: boolean) => {
    this.showDetailTextFieldModal = bool;
  });

  setEvtDetail = action((detail: string) => {
    this.eventArr[this.currentEventIdx].detail = detail;
  });

  setEventStatus = action((status: CalendarEventStatus, id: string) => {
    const found = this.eventArr.find((evt) => {
      return id === evt.eventId;
    });

    if (found) {
      found.status = status;
    }
  });

  setCurrentEventIdx = action((num: number) => {
    this.currentEventIdx = num;
  });

  setCalTabValue = action((val: CalendarTabValue) => {
    this.calTabValue = val;
  });

  setshouldRenderDays = action((bool: boolean) => {
    this.shouldRenderDays = bool;
  });

  setSearchOptions = action((arr: CalendarSearchOptionModel[]) => {
    this.searchOptions = arr;
  });

  onSearchOptChg = action(
    async (str: string, db: Realm.Services.MongoDBDatabase) => {
      this.searchOptionValue = str;

      if (str.length >= 2 && str.length % 2 === 0) {
        const opts = await getAddySearchOptions(db, str);
        this.setSearchOptions(opts);
      }
    }
  );

  getCommunityEvents = action(
    async (db: Realm.Services.MongoDBDatabase, calendarId: string) => {
      const cleanedArr: CalendarEventModel[] = [];
      const evts = await getEvents(db, calendarId);
      evts?.forEach((evt) => {
        const calEvt: CalendarEventModel = {
          title: evt.title,
          detail: evt.detail,
          eventId: evt.eventId,
          calendarId: evt.calendarId,
          timeEnd: evt.timeEnd,
          timeStart: evt.timeStart,
          color: evt.color,
          recurring: evt.recurring,
          status: evt.status || CalendarEventStatus.active,
          isHoliday: evt.isHoliday,
        };

        if (evt.isHoliday) {
          const idx: number = currentYrHolidays.findIndex((holiday) => {
            return holiday.name === evt.title;
          });

          if (idx > -1) {
            currentYrHolidays.splice(idx, 1);
          }
        }

        cleanedArr.push(calEvt);
      });

      currentYrHolidays.forEach((holiday) => {
        const calEvt: CalendarEventModel = {
          title: holiday.name,
          eventId: uuidv4(),
          calendarId: calendarId,
          timeEnd: holiday.end,
          timeStart: holiday.start,
          color: 'green',
          recurring: RecurringTime.Once,
          status: CalendarEventStatus.active,
          isHoliday: true,
        };

        cleanedArr.push(calEvt);
      });

      this.setEventArr(cleanedArr)
    }
  );

  handleCalTabChange = action(
    async (
      val: number,
      db: Realm.Services.MongoDBDatabase,
      calendarId: string
    ) => {
      if (val === CalendarTabValue.personal) {
        this.setEventArr([]);
        this.setshouldRenderDays(false);
        if (this.searchOptionValue.length > 0) {
          this.setshouldRenderDays(true);
        }
      }

      if (
        val === CalendarTabValue.community &&
        typeof calendarId === 'string'
      ) {
        this.setEventArr([]);
        await this.getCommunityEvents(db, calendarId);
        this.setshouldRenderDays(true);
      }

      this.setCalTabValue(val);
    }
  );

  removeEvt = action((evtId: string) => {
    const found = this.eventArr.findIndex((evt) => {
      return evt.eventId === evtId;
    });

    if (found) {
      this.eventArr.splice(found, 1);
      this.setCurrentEventIdx(0);
    }
  });

  changeCalTabValue = action(
    (event: React.SyntheticEvent, newValue: CalendarTabValue) => {
      this.setCalTabValue(newValue);
    }
  );

  handleSearchSubmit = action(() => {
    this.getPersonalCalDays()
    this.setshouldRenderDays(true);
  });

  setAutocompleteRef = action((ref: any) => {
    this.autocompleteRef = ref;
  });

  getPersonalCalDays = action(() => {
    const arr:CalendarEventModel[] = [];
    const currYr = dayjs().year();
    const currMonth = dayjs().month() + 1;
    const dys = dayjs().daysInMonth();
    const daysArr = [];

    const currentSelection = this.searchOptions.find((opt) => {
      return opt.label === this.searchOptionValue;
    });

    for (let i = 1; i < dys + 1; i++) {
      daysArr.push({
        weekday: days[dayjs(`${currYr}-${currMonth}-${i}`).day()],
        date: `${currYr}-${currMonth}-${i}`
      });
    }

    daysArr.forEach((dy) => {
      if (currentSelection) {
        if (
          currentSelection.recyclingDay === dy.weekday &&
          this.calendarId
        ) {
          const newEvt: CalendarEventModel = {
            title: 'Recycling',
            detail: `When in doubt, leave it out!

                        Keeping recyclable materials dry and free of grease, soil and residue is the best way to ensure success.
                        Avoid including items that can contaminate your cart. By keeping your roll cart lid closed, you will minimize
                        contact with rain and keep your materials dry. Only items listed above should be placed in the recyclable
                        materials cart; items not listed above, should be placed in the garbage roll cart. `,
            color: '#2196f3',
            eventId: uuidv4(),
            calendarId: this.calendarId,
            status: CalendarEventStatus.active,
            isHoliday: false,
            timeStart: dayjs(dy.date).toDate()
          };

          arr.push(newEvt);
          this.addEventToArr(newEvt);
        }

        if (currentSelection.trashDay === dy.weekday && this.calendarId) {
          const newEvt: CalendarEventModel = {
            title: 'Trash',
            detail: `DO NOT place the following materials/items at the curb or in your garbage roll cart:
                        â€¢ Trees or land clearing debris
                         e.g., rocks or large tree remains, including trunks, stumps or root systems regardless of how small they have been cut
                        â€¢ Cars, automotive parts, engines
                        â€¢ Boats
                        â€¢ Tires
                        â€¢ Asbestos
                        â€¢ Radioactive Materials
                        â€¢ Explosives, including propane cylinders
                        â€¢ Biomedical Waste, including sharps/syringes used for medical purposes
                        â€¢ Household Hazardous Wastes, such as:
                        Lead-acid batteries, used oil or oil filters, any product labeled toxic, poison, corrosive, flammable, irritant`,
            color: '#607d8b',
            eventId: uuidv4(),
            calendarId: this.calendarId,
            status: CalendarEventStatus.active,
            isHoliday: false,
            timeStart: dayjs(dy.date).toDate()
          };

          arr.push(newEvt);
          this.addEventToArr(newEvt);
        }

        if (currentSelection.yardDay === dy.weekday && this.calendarId) {
          const newEvt: CalendarEventModel = {
            title: 'Yard Waste',
            detail: `Household Yard Waste Collection Guidelines:

                        Containerized, Up to Four (4) Collection Containers - 30 pounds.`,
            color: '#795548',
            eventId: uuidv4(),
            calendarId: this.calendarId,
            status: CalendarEventStatus.active,
            isHoliday: false,
            timeStart: dayjs(dy.date).toDate()
          };

          arr.push(newEvt);
          this.addEventToArr(newEvt);
        }
      }
    })

    this.setEventArr(arr)
  });

  applyCurrFilter = action((day: dayjs.Dayjs) => {
    const arr: CalendarEventModel[] = [];

    if (this.calTabValue === CalendarTabValue.community) {
      this.eventArr.forEach((evt) => {
        if (evt.timeStart && evt.recurring === RecurringTime.Once) {
          const date = new Date(evt.timeStart);
          if (
            date.getDate() === day.date() &&
            date.getMonth() === day.month() &&
            date.getFullYear() === day.year()
          ) {
            arr.push(evt);
          }
        } else if (
          evt.timeStart &&
          dayjs(evt.timeStart).isSameOrBefore(day) &&
          evt.recurring === RecurringTime.Daily &&
          this.calendarId
        ) {
          arr.push(evt);
        } else if (
          evt.timeStart &&
          dayjs(evt.timeStart).isSameOrBefore(day) &&
          evt.recurring === RecurringTime.Weekly &&
          this.calendarId
        ) {
          if (days[day.day()] === days[dayjs(evt.timeStart).day()]) {
            arr.push(evt);
          }
        } else if (
          evt.timeStart &&
          dayjs(evt.timeStart).isSameOrBefore(day, 'day') &&
          evt.recurring === RecurringTime.Monthly &&
          this.calendarId
        ) {
          if (day.date() === dayjs(evt.timeStart).date()) {
            arr.push(evt);
          }
        }
      });
    }

    if (this.calTabValue === CalendarTabValue.personal) {
      this.eventArr.forEach((evt) => {
        if(day.isSame(evt.timeStart, 'day')){
          arr.push(evt)
        }
      })

    }

    return arr;
  });
}