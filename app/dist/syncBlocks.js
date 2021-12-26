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
exports.confirmParentBlockInDb = exports.storeBlockFromNodeToDb = exports.streamNewBlocksFromNodeToDb = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const config_1 = require("./config");
const db_1 = require("./db");
const storedBlockQueries_1 = require("./storedBlockQueries");
const web3_1 = require("./web3");
const streamNewBlocksFromNodeToDb = () => {
    const sub = (0, web3_1.getWeb3)().eth.subscribe("newBlockHeaders", (error, header) => {
        if (error) {
            throw "Error emittted on newBlockHeaders subscription";
        }
        const { hash, number, parentHash } = header;
        (0, exports.storeBlockFromNodeToDb)(hash);
        (0, exports.confirmParentBlockInDb)(parentHash, number);
    });
    return () => sub.unsubscribe();
};
exports.streamNewBlocksFromNodeToDb = streamNewBlocksFromNodeToDb;
const storeBlockFromNodeToDb = (hash) => __awaiter(void 0, void 0, void 0, function* () {
    const block = yield (0, web3_1.getWeb3)().eth.getBlock(hash, true);
    const totalGasSpentInEth = block.transactions
        .reduce((sum, t) => bignumber_1.BigNumber.from(t.gas).mul(t.gasPrice).add(sum), bignumber_1.BigNumber.from(0))
        .div("1000000000") // 1 ether = 1,000,000,000 gwei (10^^9)
        .toNumber();
    const upsertResult = yield (0, db_1.getBlocksCollection)().updateOne({ hash: block.hash }, Object.assign(Object.assign({}, block), { totalGasSpentInEth }), { upsert: true });
    if (!upsertResult.acknowledged) {
        throw `Error block insert not acknowledged by mongo db for block "${hash}"`;
    }
});
exports.storeBlockFromNodeToDb = storeBlockFromNodeToDb;
/** @description Sets the Xth parent (based on config) as confirmed */
const confirmParentBlockInDb = (parentHash, blockNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const confirmationsRequired = (0, config_1.getConfig)().blockConfirmationsRequired;
    const blockAtNumberToConfirm = blockNumber - confirmationsRequired;
    if (blockAtNumberToConfirm < 0) {
        return;
    }
    const blocks = yield (0, storedBlockQueries_1.getBlocksInBlockNumberRange)(blockAtNumberToConfirm, blockNumber - 1 // since we are already given the parent hash we can skip the first round of blocks
    );
    let hashToConfirm = parentHash;
    let blockToConfirm;
    // This requires blocks to be sorted descending by number
    blocks.forEach((block) => {
        if (block.number === blockAtNumberToConfirm &&
            block.hash === hashToConfirm) {
            blockToConfirm = block;
            return;
        }
        if (block.hash === hashToConfirm) {
            // havent reached the desired block number yet, lets move on to the parent
            hashToConfirm = block.parentHash;
        }
    });
    if (!blockToConfirm) {
        return;
    }
    const result = yield (0, db_1.getBlocksCollection)().updateOne({ hash: blockToConfirm.hash }, Object.assign(Object.assign({}, blockToConfirm), { confirmed: true }), { upsert: true });
    if (!result.acknowledged) {
        throw `Error block update for confirmation not acknowledged by mongo db for block "${blockToConfirm.hash}"`;
    }
});
exports.confirmParentBlockInDb = confirmParentBlockInDb;
