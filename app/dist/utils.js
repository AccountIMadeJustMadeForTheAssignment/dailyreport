"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateToUTCDayUnixTimestamp = void 0;
const dateToUTCDayUnixTimestamp = (_date) => {
    const date = new Date(Date.UTC(_date.getUTCFullYear(), _date.getUTCMonth(), _date.getUTCDay(), 0, 0, 0));
    return date.getTime() / 1000;
};
exports.dateToUTCDayUnixTimestamp = dateToUTCDayUnixTimestamp;
