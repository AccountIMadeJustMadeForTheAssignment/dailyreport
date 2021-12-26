export const dateToUTCDayUnixTimestamp = (_date: Date) => {
  const timestampInMs = Date.UTC(
    _date.getUTCFullYear(),
    _date.getUTCMonth(),
    _date.getUTCDate(),
    0,
    0,
    0
  );
  return timestampInMs / 1000;
};
