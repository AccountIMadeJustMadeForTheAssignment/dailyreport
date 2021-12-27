// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.7.0;

import "./Ownable.sol";

contract DailyReport is Ownable {
    mapping(uint256 => uint256) blocksPerDay;
    mapping(uint256 => uint256) gasFeeInWeiPerDay;

    function storeDailyReport(
        uint256 day,
        uint256 blocksThatDay,
        uint256 gasFeeInWeiThatDay
    ) external onlyOwner returns (bool success) {
        blocksPerDay[day] = blocksThatDay;
        gasFeeInWeiPerDay[day] = gasFeeInWeiThatDay;
        return true;
    }

    function getDailyReport(uint256 day)
        external
        view
        returns (uint256, uint256)
    {
        return (blocksPerDay[day], gasFeeInWeiPerDay[day]);
    }
}
