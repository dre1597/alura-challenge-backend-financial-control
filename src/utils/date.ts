export const getDateStringNow = (): string => {
  return new Date().toDateString();
};

export const getFirstDayOfMonth = (date: string): Date => {
  const year = getYear(date);
  const month = getMonth(date);

  return new Date(year, month, 1);
};

export const getLastDayOfMonth = (date: string): Date => {
  const year = getYear(date);
  const month = getMonth(date);

  return new Date(year, month + 1, 0);
};

const getYear = (date: string): number => {
  return new Date(date).getFullYear();
};

const getMonth = (date: string): number => {
  return new Date(date).getMonth();
};
