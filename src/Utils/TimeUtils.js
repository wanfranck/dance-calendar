import { sub, add } from 'date-fns';

export function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1);
}

export function getLastDayOfMonth(year, month) {
    return new Date(year, month + 1, 0);
}

export function getDays(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

export function isCurrentDay(date) {
    const now = new Date();
    return (
        date.getTime() ===
        new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    );
}

export function daysTillWeekEnd(day) {
    const result = 7 - day.getDay();
    return result === 7 ? 0 : result;
}

export function getCalendarDays(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = getFirstDayOfMonth(year, month);
    const lastDay = getLastDayOfMonth(year, month);
    const daysInMonth = getDays(year, month);

    const prevMonthDays = Array.from(
        Array(Math.max(firstDay.getDay() - 1, 0)).keys()
    )
        .map((index) => sub(new Date(year, month, 0), { days: index }))
        .reverse();
    const monthDays = Array.from(Array(daysInMonth).keys()).map((index) =>
        add(new Date(year, month, 0), { days: index + 1 })
    );
    const nextMonthDays = Array.from(
        Array(daysTillWeekEnd(lastDay)).keys()
    ).map((index) => add(new Date(year, month + 1, 0), { days: index + 1 }));

    return prevMonthDays.concat(monthDays).concat(nextMonthDays);
}

export function getWeeks(days) {
    return days.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / 7);

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
    }, []);
}
