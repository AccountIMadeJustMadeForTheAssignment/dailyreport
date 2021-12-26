const DailyReport = artifacts.require("DailyReport");

module.exports = function (deployer) {
  deployer.deploy(DailyReport);
};
