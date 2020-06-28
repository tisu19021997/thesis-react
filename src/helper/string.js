export const isoDateToString = (isoDate) => isoDate.split('T')[0];

export const nowString = () => isoDateToString(new Date(Date.now()).toISOString());

export const concatStrWithSuffix = (str, maxLength, suffix = '...') => {
  if (str.length <= maxLength) {
    return str;
  }

  return str.substr(0, maxLength + 1) + suffix;
};
