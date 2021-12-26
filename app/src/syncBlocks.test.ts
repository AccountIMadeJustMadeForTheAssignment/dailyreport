import * as config from './config';
import * as db from './db';
import { BlockDocument } from './schema';
import * as queries from './storedBlockQueries';
import { confirmParentBlockInDb } from './syncBlocks';

describe("syncBlocks", () => {
  describe("confirmParentBlockInDb", () => {
    jest
      .spyOn(config, "getConfig")
      .mockReturnValue({ blockConfirmationsRequired: 3 });
    jest
      .spyOn(queries, "getBlocksInBlockNumberRange")
      .mockImplementation(() => {
        const documents = [
          { hash: "hash15", number: 10, parentHash: "hash14" },
          { hash: "hash14", number: 9, parentHash: "hash12" },
          { hash: "hash13", number: 9, parentHash: "hash12" },
          { hash: "hash12", number: 8, parentHash: "hash10" },
          { hash: "hash11", number: 8, parentHash: "hash10" },
          { hash: "hash10", number: 7, parentHash: "hash9" },
        ];
        return Promise.resolve<BlockDocument[]>(documents as BlockDocument[]);
      });
    const updateOne = jest.fn().mockReturnValue({ acknowledged: true });
    jest.spyOn(db, "getBlocksCollection").mockReturnValue({
      updateOne,
    });
    it("sets the confirmed attribute on a block document for a given list of blocks, based on the starting has and config", async () => {
      await confirmParentBlockInDb("hash14", 10);
      expect(updateOne).toBeCalledWith(
        { hash: "hash10" },
        {
          $set: {
            confirmed: true,
            hash: "hash10",
            number: 7,
            parentHash: "hash9",
          },
        },
        { upsert: true }w
      );
    });
  });
});
