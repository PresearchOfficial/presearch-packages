function getTime(timestamp) {
    const mili = timestamp * 1000;
    const date = new Date(mili);

    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function getDate(timestamp) {
    const mili = timestamp * 1000;
    const date = new Date(mili);

    if (isDateCloseOrEqualToday(date, 0)) {
        return 'Today';
    }
    if (isDateCloseOrEqualToday(date, 1)) {
        return 'Tomorrow';
    }
    if (isDateCloseOrEqualToday(date, -1)) {
        return 'Yesterday';
    }

    return date.toLocaleString("en-US", { weekday: "short" })
        + ", " + date.toLocaleString("en-US", { month: "short" })
        + " " + date.toLocaleString("en-US", { day: "numeric" });
}

function isDateCloseOrEqualToday(date, nDays) {
    const dateToCompare = new Date();
    dateToCompare.setDate(dateToCompare.getDate() + nDays);

    return date.getDate() == dateToCompare.getDate() &&
        date.getMonth() == dateToCompare.getMonth() &&
        date.getFullYear() == dateToCompare.getFullYear();
}

module.exports = {getDate, getTime}