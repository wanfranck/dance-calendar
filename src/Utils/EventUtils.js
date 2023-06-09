import { parse, add } from 'date-fns';
import { dateFormat } from '../constants';

export function isEventInDay(event, day) {
    const date = parse(event.date, dateFormat, new Date());
    return date >= day && date < add(day, { hours: 24 });
}

export function getEventsForSelection(events, selection) {
    return events.filter((event) => {
        for (const day of selection) {
            if (isEventInDay(event, day)) {
                return true;
            }
        }

        return false;
    });
}

export function getEventsAfter(events, day) {
    return events.filter((event) => {
        const date = parse(event.date, dateFormat, new Date());
        return date >= day;
    });
}
/**
 * check is day in event duration
 * @param {Date} day 
 * @param {Array<Date>} duration array of start and end date of event
 */
export const isDayInEventDuration = (day, duration) => 
    duration.length === 2 && day >= duration[0] && day <= duration[1];
