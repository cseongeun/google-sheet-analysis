const schedule = require("node-schedule");
const Service = require("../services");
const models = require("../models");
const _ = require("underscore");

const chunkSize = 100;

const convertDate = (timestamp) => {
  const d = new Date(timestamp * 1000);
  return (
    d.getFullYear() +
    ("0" + (d.getMonth() + 1)).slice(-2) +
    ("0" + d.getDate()).slice(-2)
  );
};

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

const insertTokenHolder = async (
  contract,
  sender,
  receiver,
  blockNumber,
  transaction
) => {
  try {
    const findFrom = await models.TokenHolder.findOne({
      where: {
        contract_address: contract,
        address: sender,
      },
      transaction,
    });
    const findTo = await models.TokenHolder.findOne({
      where: {
        contract_address: contract,
        address: receiver,
      },
      transaction,
    });
  
    console.log('1');

    if (_.isNull(findFrom)) {
       await models.TokenHolder.create(
        {
          contract_address: contract,
          address: sender,
          num_of_receive: 1,
          activate_block_height: blockNumber,
          deactivate_block_height: blockNumber,
        },
        { transaction }
      );
    } else {
      await models.TokenHolder.update(
        {
          num_of_send: findFrom.get("num_of_send") + 1,
          deactivate_block_height: blockNumber,
        },
        {
          where: {
            contract_address: contract,
            address: receiver,
          },
          transaction,
        }
      );
    }
    console.log('2');
    if (_.isNull(findTo)) {
      await models.TokenHolder.create(
        {
          contract_address: contract,
          address: receiver,
          num_of_receive: 1,
          activate_block_height: blockNumber,
          deactivate_block_height: blockNumber,
        },
        { transaction }
      );
    } else {
      await models.TokenHolder.update(
        {
          num_of_receive: findTo.get("num_of_receive") + 1,
          deactivate_block_height: blockNumber,
        },
        {
          where: {
            contract_address: contract,
            address: receiver,
          },
          transaction,
        }
      );
    }
  } catch (e) {
    console.log(e);
  }
 
};

const insertTransferPerDay = async (
  contract,
  value,
  blockNumber,
  transaction
) => {
  const block = await Service.Ethereum.getBlock(blockNumber);
  const blockTimestamp = block.timestamp;
  const blockDate = convertDate(blockTimestamp);

  const day = await models.TransferPerDay.findOne({
    where: {
      contract_address: contract,
      date: blockDate,
    },
    transaction,
  });

  if (_.isNull(day)) {
    await models.TransferPerDay.create(
      {
        contract_address: contract,
        date: blockDate,
        num_of_transfer: 1,
        amount_of_transfer: value,
      },
      { transaction }
    );
  } else {
    await models.TransferPerDay.update(
      {
        num_of_transfer: item.get("num_of_transfer") + 1,
        amount_of_transfer: item.get("amount_of_transfer") + value,
      },
      {
        where: {
          contract_address: contract,
        },
        transaction,
      }
    );
  }
};

const updateProperty = async (contract, startBlock, endBlock, transaction) => {
  try {
    const events = await Service.Ethereum.getTransferEvents(
      contract,
      startBlock,
      endBlock
    );
    if (events.length <= 0) return
    events.forEach(async ({ blockNumber, returnValues: { from, to } }) => {
      await insertTokenHolder(contract, from, to, blockNumber, transaction);
      // await insertTransferPerDay(contract, value, blockNumber, transaction);
    });
  } catch (e) {
    console.log(e);
  }
};

const job = async () => {
  const transaction = await models.sequelize.transaction();
  try {
    const tokens = await processTokens();
    
    if (tokens.length <= 0) return true;

    const latestBlockHeight = await Service.Ethereum.getBlockNumber();

    await Promise.all(
      tokens.map(async (token) => {
        const contractAddress = token.get("contract_address");
        let startBlock = token.get("block_height") + 1;
        let endBlock = latestBlockHeight;

        if (startBlock > endBlock) return true;
        if (endBlock - startBlock + 1 > chunkSize) {
          endBlock = startBlock + chunkSize - 1;
        }

        await updateProperty(
          contractAddress,
          startBlock,
          endBlock,
          transaction
        );
        await updateBlock(contractAddress, endBlock, transaction);
      })
    );
    
    await transaction.commit();
  } catch (e) {
    console.log(e);
    await transaction.rollback();
  }
};

job();

module.exports = {
  job,
}
// schedule.scheduleJob("*/10 * * * * *", job);
