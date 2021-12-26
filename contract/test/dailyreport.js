
const DailyReport = artifacts.require("DailyReport");

contract('DailyReport', (accounts) => {

  const thatDay = Date.UTC(2021, 12, 4, 0, 0, 0, 0) / 1000;
  const blocksThatDay = 12;
  const feePaidThatDay = 1001;

  it('should add the block count and gas fee for a give date ', async () => {
    const DailyReportInstance = await DailyReport.deployed();
    const success = await DailyReportInstance.storeDailyReport.call(thatDay, blocksThatDay, feePaidThatDay);
    assert.equal(success, true, "Report was not succesfully stored");

    const result = await DailyReportInstance.getDailyReport.call(thatDay);
    assert.equal(result[0].toNumber(), blocksThatDay, "Returned number of blocks differs from the previously stored number");
    assert.equal(result[1].toNumber(), feePaidThatDay, "Returned fees differs from the previously stored number");
  });
  it('should return 0 when accessing a non stored day', async () => {
    const DailyReportInstance = await DailyReport.deployed();
    const result = await DailyReportInstance.getDailyReport.call(123);
    assert.equal(result[0].toNumber(), 0, "Returned number of blocks for the date was not 0");
    assert.equal(result[1].toNumber(), 0, "Returned fees for the date was not 0");
  });
  // it('should return the previously stored report data', async () => {
  //   const DailyReportInstance = await DailyReport.deployed();

  //   assert.equal(result[0], blocksThatDay, "Returned number of blocks differs from the previously stored number");
  //   assert.equal(result[1], feePaidThatDay, "Returned fees differs from the previously stored number");
  // });
});
