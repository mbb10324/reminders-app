//creates a dates array with all the days in a month
export function getAllDaysInMonth(year, month) {
    const date = new Date(year, month, 1);
    const dates = [];
    while (date.getMonth() === month) {
        let temp = new Date(date)
        let tempDay = date.toLocaleString('default', { weekday: 'short' })
        dates.push(
            {
                "dayNum": temp.getDate(),
                "dayName": tempDay
            }
        );
        date.setDate(date.getDate() + 1);
    };
    return dates;
}
//identifys first monday of every week
export function findFirstMonday(list) {
    return list.find(item => item.dayName === 'Mon');
}
//seperates array into smaller arrays
export function chunk(length, list) {
    const chunks = [];
    for (let i = 0; i < list.length; i += length) {
        chunks.push(list.slice(i, i + length))
    }
    return chunks;
}
//determines where to split up array
export function splitAt(index, list) {
    return [
        list.slice(0, index),
        list.slice(index),
    ];
}
//splits array of all the days in a month into array of the month with array of week with days in the weeks
export function splitMonthIntoWeeks(daysOfTheMonth) {
    const firstMonday = findFirstMonday(daysOfTheMonth);
    const firstMondayIndex = daysOfTheMonth.indexOf(firstMonday);
    const [daysBeforeFirstMonday, daysStartingAtFirstMonday] = splitAt(firstMondayIndex, daysOfTheMonth);
    if (daysBeforeFirstMonday.length === 0) {
        return chunk(7, daysOfTheMonth);
    }
    return [daysBeforeFirstMonday, ...chunk(7, daysStartingAtFirstMonday)];
}
//final formatting of our month array
export function getInitialWeeks(date) {
    return splitMonthIntoWeeks(getAllDaysInMonth(date.getFullYear(), date.getMonth()));
}
//fills a week with 5 days whether days exist or not ex:({}, {}, {}, {Thu}, {Fri})
export function buildWeek(week) {
    if (week.length === 7) {
        return week;
    }
    if (week.find(w => w.dayName === 'Mon')) {
        return [...week, ...(new Array(7 - week.length)).fill({})];
    }
    return [...(new Array(7 - week.length)).fill({}), ...week];
}
//finds the index of the current week
export function getIndexOfThisWeek(weeks) {
    const today = new Date();
    const dayName = today.toLocaleString('default', { weekday: 'short' });
    const thisWeek = weeks.find((week) => {
        return week.find(day => day.dayNum === today.getDate() && day.dayName === dayName);
    });
    const index = weeks.indexOf(thisWeek);
    return index === -1 ? undefined : index;
}
//determines what week we are on based off irl week or if user has been to app before
export function getInitialWeek(cookies, weeks) {
    if (!cookies.month && !cookies.index) {
        return getIndexOfThisWeek(weeks);
    }
    if (cookies.index) {
        return parseInt(cookies.index);
    }
    return 0;
}
//determines what month it should be on render based off irl month or if user has been to app before
export function getInitialMonth(cookies, date) {
    return cookies.month ? parseInt(cookies.month) : date.getMonth()
}

//function responsible for filtering reminders per day
export function filterReminders(allReminders, selectedMonth, dayNum) {
    if (!dayNum) return [];
    return allReminders.filter((reminder) => {
        const date = new Date((reminder.date).replace(/-/g, '\/'));
        return date.getDate() === dayNum
            && date.getMonth() === selectedMonth;
    });
}

//function to test inputs after x amount of ms
let timeoutId;
export function debounce(ms, action) {
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            action(...args);
        }, ms);
    };
}
