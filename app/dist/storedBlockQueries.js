"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlocksInBlockNumberRange = exports.getTotalGasForDateRangeFromDb = exports.getBlockFromDb = void 0;
const db_1 = require("./db");
const utils_1 = require("./utils");
/** @file Read only queries on top of the db */
const getBlockFromDb = (hash) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield (0, db_1.getBlocksCollection)().findOne({
        hash,
    });
    return document;
});
exports.getBlockFromDb = getBlockFromDb;
/** @param start Will only consider blocks with a timestamp larger or equal to the day of the given start date (starting at midnight UTC) */
/** @param end Will only consider block with a time stamp smaller than the day of the given end date */
const getTotalGasForDateRangeFromDb = (start, end) => __awaiter(void 0, void 0, void 0, function* () {
    const startStamp = (0, utils_1.dateToUTCDayUnixTimestamp)(start);
    const endStamp = (0, utils_1.dateToUTCDayUnixTimestamp)(end);
    const document = yield (0, db_1.getBlocksCollection)()
        .aggregate([
        {
            $match: {
                timestamp: {
                    $gte: startStamp,
                    $lt: endStamp,
                },
                confirmed: true,
            },
        },
        {
            $group: {
                _id: "dailyTotalGasFee",
                totalGasSpentInEth: { $sum: "$totalGasSpentInEth" },
                blocks: { $sum: 1 },
            },
        },
    ])
        .next();
    if (!document) {
        throw "No document returned when aggregatig for total gas fee";
    }
    return document;
});
exports.getTotalGasForDateRangeFromDb = getTotalGasForDateRangeFromDb;
/** @description returns all stored blocks within the range of the given block numbers, including the blocks with those numbers, sorted by block number descending */
const getBlocksInBlockNumberRange = (from, to) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, db_1.getBlocksCollection)()
        .find([
        {
            number: {
                $gte: from,
                $lte: to,
            },
        },
    ])
        .sort({ number: -1 })
        .toArray();
    return result;
});
exports.getBlocksInBlockNumberRange = getBlocksInBlockNumberRange;
