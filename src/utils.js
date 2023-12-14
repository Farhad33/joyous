import moment from 'moment-timezone'

const createTimeSlots = (start, end) => {
    let times = [];
    let currentTime = moment(start, 'HH:mm');
    let endTime = moment(end, 'HH:mm');

    while (currentTime.isBefore(endTime)) {
        times.push(currentTime.format('hh:mm A'));
        currentTime.add(15, 'minutes');
    }

    if (currentTime.format('HH:mm') === endTime.format('HH:mm')) {
        times.push(endTime.format('hh:mm A'));
    }

    return times;
};

const sortDateRanges = (dateRanges) => {
    return dateRanges.sort((a, b) => {
        if (a.start < b.start) {
            return -1;
        }
        if (a.start > b.start) {
            return 1;
        }
        return 0;
    })
}

export const processAvailabilityData = ({ dateRanges, timeZone }) => {
    let timeSlotsForDay = {};
    const todayKey = moment().format('ddd MMM Do');
    const tomorrowKey = moment().add(1, 'days').format('ddd MMM Do');

    sortDateRanges(dateRanges).forEach((range) => {
        const startMomentLocal = moment(range.start).tz(timeZone);
        let dayKey = startMomentLocal.format('ddd MMM Do');

        if (dayKey === todayKey) {
            dayKey = 'Today';
        } else if (dayKey === tomorrowKey) {
            dayKey = 'Tomorrow';
        }

        const endMomentLocal = moment(range.end).tz(timeZone);
        const slots = createTimeSlots(startMomentLocal, endMomentLocal);

        if (timeSlotsForDay[dayKey]) {
            timeSlotsForDay[dayKey] = [...new Set([...timeSlotsForDay[dayKey], ...slots])]
                .sort((a, b) => moment(a, 'hh:mm A').diff(moment(b, 'hh:mm A')));
        } else {
            timeSlotsForDay[dayKey] = slots;
        }
    });

    return timeSlotsForDay;
};