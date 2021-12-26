"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storePreviousDaysVolumeInContract = void 0;
const storedBlockQueries_1 = require("./storedBlockQueries");
const storePreviousDaysVolumeInContract = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const { blocks, totalGasSpentInEth } = yield (0, storedBlockQueries_1.getTotalGasForDateRangeFromDb)(yesterday, now);
    // TODO send data to contract
});
exports.storePreviousDaysVolumeInContract = storePreviousDaysVolumeInContract;
