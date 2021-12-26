import { dateToUTCDayUnixTimestamp } from './utils';

describe("utils", () => {
  describe("dateToUTCDayUnixTimestamp", () => {
    it("returs the given dates date at UTC midnight as a unix epoch timestamp", () => {
      const date = new Date("2021-12-26T07:45:58.676Z");
      expect(dateToUTCDayUnixTimestamp(date)).toBe(1640476800);
    });
  });
});
