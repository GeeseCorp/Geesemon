export const getTimeWithoutSeconds = (date: Date) => {
    return date.toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
}

export const getDayAndMonth = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', day: "numeric" });
}
