const schedule = require("node-schedule");
const Service = require("../services");
const models = require("../models");
const _ = require("underscore");

const chunkSize = 10000;

const processTokens = async () => {
  return models.Token.findAll({
    where: {
      process: true,
    },
  });
};

const updateBlock = async (contract, height, transaction) => {
  return models.Token.update(
    {
      block_height: height,
    },
    {
      where: {
        contract_address: contract,
      },
      transaction,
    }
  );
};

const insertSender = async (contract, sender, blockNumber, t) => {
  try {
    const item = await models.TokenHolder.findOne({
      where: {
        contract_address: contract,
        address: sender,
      },
      transaction: t,
    });

    if (_.isNull(item)) {
      await models.TokenHolder.create(
        {
          contract_address: contract,
          address: sender,
          num_of_send: 1,
          activate_block_height: blockNumber,
          deactivate_block_height: blockNumber,
        },
        { transaction: t }
      );
    } else {
      await models.TokenHolder.update(
        {
          num_of_receive: item.get("num_of_send") + 1,
          deactivate_block_height: blockNumber,
        },
        {
          where: {
            contract_address: contract,
            address: sender,
          },
          transaction: t,
        }
      );
    }
  } catch (e) {
    console.log(e);
  }
};

const insertReceiver = async (contract, receiver, blockNumber, t) => {
  try {
    const item = await models.TokenHolder.findOne({
      where: {
        contract_address: contract,
        address: receiver,
      },
      transaction: t,
    });
    if (_.isNull(item)) {
      await models.TokenHolder.create(
        {
          contract_address: contract,
          address: receiver,
          num_of_receive: 1,
          activate_block_height: blockNumber,
          deactivate_block_height: blockNumber,
        },
        { transaction: t }
      );
    } else {
      await models.TokenHolder.update(
        {
          num_of_receive: item.get("num_of_receive") + 1,
          deactivate_block_height: blockNumber,
        },
        {
          where: {
            contract_address: contract,
            address: receiver,
          },
          transaction: t,
        }
      );
    }
  } catch (e) {
    console.log(e);
  }
};

const updateTokenHolder = async (
  contract,
  startBlock,
  endBlock,
  transaction
) => {
  try {
    const events = await Service.Ethereum.getTransferEvents(
      contract,
      startBlock,
      endBlock
    );
    events.map(async ({ blockNumber, returnValues: { from, to } }) => {
      await insertSender(contract, from, blockNumber, transaction);
      await insertReceiver(contract, to, blockNumber, transaction);
    });
  } catch (e) {
    console.log(e);
  }
};

const job = async () => {
  const t = await models.sequelize.transaction({
    isolationLevel:
      models.Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  });
  try {
    const tokens = await processTokens();

    if (tokens.length <= 0) return true;

    const latestBlockHeight = await Service.Ethereum.getBlockNumber();

    await Promise.all(
      tokens.map(async (token) => {
        try {
          const contractAddress = token.get("contract_address");
          let startBlock = token.get("block_height") + 1;
          let endBlock = latestBlockHeight;

          if (startBlock > endBlock) return true;
          if (endBlock - startBlock + 1 > chunkSize) {
            endBlock = startBlock + chunkSize - 1;
          }

          await updateTokenHolder(contractAddress, startBlock, endBlock, t);
          await updateBlock(contractAddress, endBlock, t);
        } catch (e) {}
      })
    );
    await t.commit();
  } catch (e) {
    console.log(e);
    await t.rollback();
  }
};

schedule.scheduleJob("*/10 * * * * *", job);
