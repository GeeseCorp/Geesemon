export const getTimeWithoutSeconds = (date: Date) => {
    console.log(date.toLocaleTimeString().replace(/(.*)\D\d+/, '$1'))
    return date.toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
}
