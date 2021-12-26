export const dateToUTCDayUnixTimestamp = (_date: Date) => {
  const date = new Date(
    Date.UTC(
      _date.getUTCFullYear(),
      _date.getUTCMonth(),
      _date.getUTCDay(),
      0,
      0,
      0
    )
  );
  return date.getTime() / 1000;
};
