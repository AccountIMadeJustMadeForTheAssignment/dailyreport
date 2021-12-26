import { WithId } from 'mongodb';
import { BlockTransactionObject } from 'web3-eth';

export type BlockDocument = WithId<
  BlockTransactionObject & {
    confirmed?: boolean;
    totalGasSpentInWei: number;
  }
>;
