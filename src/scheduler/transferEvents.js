const Service = require('../services');


const getUnFinishedToken = () => {


}

const parseTransferEvents = async (contractAddress, startBlock, endBlock) => {
  const events = await getTransferEvents(contractAddress, startBlock, endBlock);
  const numOfSend = {};
  const transactions = events.map(({
    returnValues: { from, to, value },
    blockNumber,
    transactionHash,
  }) => {      
    if (!numOfSend.hasOwnProperty(from)) {
      numOfSend[from] = 0;
    }
    numOfSend[from] += 1;
    return {
      transactionHash,
      blockNumber,
      from,
      to,
      value,
    }
  })
  return { transactions, numOfSend };
}

const saveTransferEvents = async (contractAddress, insertData, endBlock) => {
  const filePath = `${dataPath}/${contractAddress}.json`;
  let data = fs.readFileSync(filePath);
  data = JSON.parse(data);

  data.transactions = data.transactions.concat(insertData.transactions);
  data.numOfSend = Object.assign(data.numOfSend, insertData.numOfSend);
  data.nowBlock = endBlock;

  if (endBlock === data.endBlock) {
    data.finished = true;
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data) , 'utf8');
}

const job = async () => {
  try {
    const unFinished = getUnFinishedToken();

    await Promise.all(
      unFinished.map(async (u)=> {
        const { file, nowBlock, endBlock, contractAddress } = u;
  
        let fromBlock = nowBlock + 1;
        let toBlock = endBlock;
  
        if (toBlock - fromBlock + 1 > chunkSize) {
          toBlock = fromBlock + chunkSize - 1;
        }
  
        const insertData = await parseTransferEvents(contractAddress, fromBlock, toBlock);
        await saveTransferEvents(contractAddress, insertData, toBlock);
      })
    )
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  job
}