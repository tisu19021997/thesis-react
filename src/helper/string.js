export const isoDateToString = (isoDate) => isoDate.split('T')[0];

export const nowString = () => isoDateToString(new Date(Date.now()).toISOString());
