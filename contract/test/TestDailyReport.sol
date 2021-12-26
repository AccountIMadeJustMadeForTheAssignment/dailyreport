pragma solidity >=0.4.25 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DailyReport.sol";

contract TestDailyReport {
    function testOwnerIsSet() public {
        DailyReport report = DailyReport(DeployedAddresses.DailyReport());

        Assert.equal(
            report.owner(),
            tx.origin,
            "Owner should be set to same origin as deploymennt"
        );
    }

    function testReportIsStoredAndRetrieved() public {
        DailyReport report = new DailyReport();

        Assert.equal(
            report.storeDailyReport(1990, 10, 1001),
            true,
            "Should be able to set the daily report data"
        );

        (uint256 blocks, uint256 fees) = report.getDailyReport(1990);
        Assert.equal(blocks, 10, "Should return the correct ammount of blocks");
        Assert.equal(fees, 1001, "Should return the correct ammount of fees");
    }
}
