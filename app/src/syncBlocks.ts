import { BigNumber } from '@ethersproject/bignumber';

import { getConfig } from './config';
import { getBlocksCollection } from './db';
import { BlockDocument } from './schema';
import { getBlocksInBlockNumberRange } from './storedBlockQueries';
import { getWeb3 } from './web3';

export const streamNewBlocksFromNodeToDb = () => {
  const sub = getWeb3().eth.subscribe("newBlockHeaders", (error, header) => {
    if (error) {
      console.error(error);
      throw Error("Error emittted on newBlockHeaders subscription");
    }
    const { hash, number, parentHash } = header;
    storeBlockFromNodeToDb(hash);
    confirmParentBlockInDb(parentHash, number);
  });
  return () => sub.unsubscribe();
};

export const storeBlockFromNodeToDb = async (hash: string) => {
  const block = await getWeb3().eth.getBlock(hash, true);

  const totalGasSpentInWei = block.transactions
    .reduce(
      (sum, t) => BigNumber.from(t.gas).mul(t.gasPrice).add(sum),
      BigNumber.from(0)
    )
    .toNumber();

  const upsertResult = await getBlocksCollection().updateOne(
    { hash: block.hash },
    { ...block, totalGasSpentInWei },
    { upsert: true }
  );

  if (!upsertResult.acknowledged) {
    throw `Error block insert not acknowledged by mongo db for block "${hash}"`;
  }
};
/** @description Sets the Xth parent (based on config) as confirmed */
export const confirmParentBlockInDb = async (
  parentHash: string,
  blockNumber: number
) => {
  const confirmationsRequired = getConfig().blockConfirmationsRequired;
  const blockAtNumberToConfirm = blockNumber - confirmationsRequired;
  if (blockAtNumberToConfirm < 0) {
    return;
  }
  const blocks = await getBlocksInBlockNumberRange(
    blockAtNumberToConfirm,
    blockNumber - 1 // since we are already given the parent hash we can skip the first round of blocks
  );
  let hashToConfirm = parentHash;
  let blockToConfirm: BlockDocument | undefined;

  // This requires blocks to be sorted descending by number
  blocks.forEach((block) => {
    if (
      block.number === blockAtNumberToConfirm &&
      block.hash === hashToConfirm
    ) {
      blockToConfirm = block;
      return;
    }
    if (block.hash === hashToConfirm) {
      // havent reached the desired block number yet, lets move on to the parent
      hashToConfirm = block.parentHash;
    }
  });
  if (!blockToConfirm) {
    return;
  }
  const result = await getBlocksCollection().updateOne(
    { hash: blockToConfirm.hash },
    { ...blockToConfirm, confirmed: true },
    { upsert: true }
  );
  if (!result.acknowledged) {
    throw `Error block update for confirmation not acknowledged by mongo db for block "${blockToConfirm.hash}"`;
  }
};
