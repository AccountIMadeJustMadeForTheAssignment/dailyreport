// You would want  to load these from environment variables
const config = {
  // should use an authenticated connection instead
  mongoDbUri: "mongodb://localhost:27017/",
  mongoDbName: "blocks-prod",
  ethNodeUrl: "ws://localhost:9545",
  blockConfirmationsRequired: 3,
  dailyReportContractAddress: "0x1202CEa79FFB92590b1673B3b7E98b0B7AbC8977",
  dailyReportOwnerAddress: "0xD98B6386A36C00b0f346AF5359cfb34894196997",
};
export const getConfig = () => config;
