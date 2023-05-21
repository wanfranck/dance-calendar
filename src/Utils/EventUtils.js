import { parse, add } from 'date-fns';

export function isEventInDay(event, day) {
    const date = parse(event.date, 'dd-MM-yyyy', new Date());
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
        const date = parse(event.date, 'dd-MM-yyyy', new Date());
        return date >= day;
    });
}
