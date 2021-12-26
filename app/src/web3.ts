import Web3 from 'web3';

import { getConfig } from './config';

let _web3: Web3 | undefined;
export const getWeb3 = () => {
  if (!_web3) {
    _web3 = new Web3(getConfig().ethNodeUrl);
  }
  return _web3;
};
