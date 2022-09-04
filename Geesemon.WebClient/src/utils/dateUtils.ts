export const getTimeWithoutSeconds = (date: Date) => {
    return date.toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
}

export const getDayAndMonth = (date: Date) => {
    return date.toLocaleString('default', {month: 'long', day: "numeric"});
}

export const getDate = (date: Date) => {
    const mm = date.getMonth() + 1;
    const dd = date.getDate();

    return [date.getFullYear(), '.', (mm > 9 ? '' : '0') + mm, '.', (dd > 9 ? '' : '0') + dd].join('');
}

