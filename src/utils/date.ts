export const toISODate = (isDate: number, minDate?: any) =>
  isDate
    ? `${new Date(isDate * 1000).toISOString()}`
    : `${new Date(minDate && minDate).toISOString()}`;
