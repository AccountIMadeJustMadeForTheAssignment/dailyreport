import { getBlocksCollection } from './db';
import { BlockDocument } from './schema';
import { dateToUTCDayUnixTimestamp } from './utils';

/** @file Read only queries on top of the db */

export const getBlockFromDb = async (hash: string) => {
  const document = await getBlocksCollection().findOne({
    hash,
  });
  return document as BlockDocument | null;
};
/** @param start Will only consider blocks with a timestamp larger or equal to the day of the given start date (starting at midnight UTC) */
/** @param end Will only consider block with a time stamp smaller than the day of the given end date */
export const getTotalGasForDateRangeFromDb = async (start: Date, end: Date) => {
  const startStamp = dateToUTCDayUnixTimestamp(start);
  const endStamp = dateToUTCDayUnixTimestamp(end);
  const document = await getBlocksCollection()
    .aggregate<{ totalGasSpentInWei: number; blocks: number }>([
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
          totalGasSpentInWei: { $sum: "$totalGasSpentInWei" },
          blocks: { $sum: 1 },
        },
      },
    ])
    .next();
  if (!document) {
    throw "No document returned when aggregatig for total gas fee";
  }
  return document;
};

/** @description returns all stored blocks within the range of the given block numbers, including the blocks with those numbers, sorted by block number descending */
export const getBlocksInBlockNumberRange = async (from: number, to: number) => {
  const result = await getBlocksCollection()
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
};
