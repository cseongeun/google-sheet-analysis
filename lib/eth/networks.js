const Web3 = require('web3');
const { endPoint } = require('../../config');

const web3 = new Web3(endPoint.mainnet);

exports.getBlockNumber = async () => {    
  return web3.eth.getBlockNumber();
}


