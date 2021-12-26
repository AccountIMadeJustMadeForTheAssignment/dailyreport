## 1. Setup

Requrirements:

- node.js (I used 16.13.1)
- yarn (I used 1.22.10)
- Truffle (I used 5.4.14 )
- Solidity (v0.5.16)
- MongoDB

I would have liked to put it all into docker and just give to you a single command to run but I ran out of time, and I am not really familiar with that either.

### Run the database

I guess any mongodb instance running somewhere will do. This is what I used as it was quick to setup:

```
docker run -p 27017:27017 --name mongodb mongo
```

Which should load the mongodb image from docker hub and run it exposing it locally on port `27017`.

### Run a ETH dev environment

I used truffle for this. In the `contract/` directory run `truffle develop` to start the console, note the port of node running in output. Deploy the report contract in the console via `migrate`. This should deploy the contract. Note the deployed address and owner address. The node used by truffle should have access to the owner address.

In `app/src/config.ts` set the `dailyReportContractAddress` and the `dailyReportOwnerAddress` accordingly. Also set the port in `ethNodeUrl` accoridngly.

### Setup app

In the `app` directory run `yarn` that should install all the required node modules for the app itself. In the same direcory then run `yarn start-app`, that will start a node http server which listens to the

## 2. Run Tests

In the `app` directory run `yarn test`.
I the `contract` directory run `truffle test`

# 3. On the design

This whole thing is a bit crude. The app effectively just streams any blocks coming in from the configured node and writes it to the mongo db. Figured this will also include uncle blocks, which shouldnt be included when we tally up the daily transaction fee total. To figure out which blocks to consider for the summation the app just sets the block 3 (configurable) blocks before - in direct parental lineage (great-grandfather in family tree terms I guess) of the newly added block. The cronjob that queries the DB, will only consider the confirmed blocks.

The whole app, by design, is not fault tolerant at all. If a block is missed for some reason, it wont be filled in - any previous blocks cant be confirmed. This is something that should be improved.

The contract itself is most simple, it effectively just a key value store with an API on top. I added the Ownerable from OpenZeplin to make sure noone unauthorized can fill it with some mischivious data. (I guess thats the rationale behind that task requirement).

# 4. Feedback

I found this to be an interesting task. Mainly due to the realization that a block number can have multiple blocks and how to work arround that. However most of my time spend was on figuring out how to setup the database, and writing the test in solidity - which was a less fun. I guess the second part would have been quicker with better tooling, but I am just too new to this still I guess.
I started working on this saturday evening and worked on and off on it on sunday. I would say the result is in total slighly more than a days work.
I would have liked to add more and better tests. E.g. just start up a new DB instance, a node with the contract deployed, run a bunch of transactions with specified gas fee, and tweak the apps system time to trigger the cron job to push the report to the contract and then just compare what is stored in the contract with what is expected.
