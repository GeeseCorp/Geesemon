export const getTimeWithoutSeconds = (date: Date): string => {
  return date.toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
};

export const getDayAndMonth = (date: Date): string => {
  return date.toLocaleString('default', { month: 'long', day: 'numeric' });
};

export const getDate = (date: Date): string => {
  const mm = date.getMonth() + 1;
  const dd = date.getDate();

  return [date.getFullYear(), '.', (mm > 9 ? '' : '0') + mm, '.', (dd > 9 ? '' : '0') + dd].join('');
};

export const getLastTimeActivity = (date: Date): string => {
  return getTimeWithoutSeconds(date) + ' ' + getDate(date);
};

export const fancyTimeFormat = (duration: number) => {
  const hrs = ~~(duration / 3600);
  const mins = ~~((duration % 3600) / 60);
  const secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = '';

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;

  return ret;
};
