const Web3 = require('web3');
const ERC20ABI = require('../constants/ERC20.abi');
const { endPoint } = require('../config');

const web3 = new Web3(endPoint.mainnet);

const getSymbol = async (contractAddress) => {
  const contract = new web3.eth.Contract(ERC20ABI, contractAddress);
  return contract.methods.symbol().call();
}

const getTransferEvents = async (contractAddress, startBlock, endBlock) => {
  const contract = new web3.eth.Contract(ERC20ABI, contractAddress);
    
  return new Promise((resolve, reject) => {
    contract.getPastEvents('Transfer', {
      fromBlock: startBlock,
      toBlock: endBlock
    }, (err, events) => {
      if (err) reject(`Failed to get Event, contractAddress: ${contractAddress} with ${err}`);
      resolve(events)
    })
  })
}

const getBlockNumber = async () => {    
  return web3.eth.getBlockNumber();
}

const getBlock = async (blockHeight) => {
  return web3.eth.getBlock(blockHeight);
}


module.exports = {
  getTransferEvents,
  getBlockNumber,
  getSymbol,
  getBlock,
}
