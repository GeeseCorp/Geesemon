export const getTimeWithoutSeconds = (date: Date) => {
    return date.toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
}
