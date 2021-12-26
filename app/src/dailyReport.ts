import { CronJob } from 'cron';
import { Contract } from 'web3-eth-contract';

import { getConfig } from './config';
import { getTotalGasForDateRangeFromDb } from './storedBlockQueries';
import { dateToUTCDayUnixTimestamp } from './utils';

export const setupCronJobForDailyReport = () => {
  const job = new CronJob(
    "5 0 * * * *", // everyday 5 minutes after midnight
    function () {
      storePreviousDaysVolumeInContract();
    },
    null,
    true,
    undefined,
    undefined,
    undefined,
    0 // UTC offset, gotta make sure its 0 so it starts 5 minutes after midnight
  );
  return job;
};

export const storePreviousDaysVolumeInContract = async () => {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const result = await getTotalGasForDateRangeFromDb(yesterday, now);
  if (!result) {
    return;
  }
  const { blocks, totalGasSpentInWei } = result;
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
