import { Contract } from 'web3-eth-contract';

import { getConfig } from './config';
import { getTotalGasForDateRangeFromDb } from './storedBlockQueries';
import { dateToUTCDayUnixTimestamp } from './utils';

export const storePreviousDaysVolumeInContract = async () => {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const { blocks, totalGasSpentInWei } = await getTotalGasForDateRangeFromDb(
    yesterday,
    now
  );
  const success = await getDailyReportContract().methods.storeDailyContract(
    dateToUTCDayUnixTimestamp(yesterday),
    blocks,
    totalGasSpentInWei
  );
  if (!success) {
    throw Error("Did not store daily report in contract");
  }
};
let _contract: Contract | undefined;
const getDailyReportContract = () => {
  if (!_contract) {
    const contractAddress = getConfig().dailyReportContractAddress;
    const calleeAddress = getConfig().dailyReportOwnerAddress;
    _contract = new Contract(
      [
        {
          type: "function",
          name: "storeDailyContract",
          inputs: [
            { name: "day", type: "uint256" },
            { name: "blocksThatDay", type: "uint256" },
            { name: "feeThatDay", type: "uint256" },
          ],
          outputs: [{ name: "success", type: "bool" }],
        },
      ],
      contractAddress
    );
    _contract.defaultAccount = calleeAddress;
  }
  return _contract;
};
