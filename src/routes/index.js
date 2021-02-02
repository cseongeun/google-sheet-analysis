const express = require('express');
const fs = require('fs');

// const { dataPath } = require('../config');

const Service = require('../services')

const router = express.Router();


// router.post('/register', async function(req, res, next) {
//   const { contractAddress, startBlock } = req.query;

//   const endBlock = await getBlockNumber();
  
//   const filePath = `${dataPath}/${contractAddress}.json`;
//   const existedFile = await fs.existsSync(filePath);
//   if (existedFile) {
//     let data = fs.readFileSync(filePath, 'utf8');
//     data = JSON.parse(data);
//     data.endBlock = endBlock;
//     data.finished = false;
//     fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
//   } else {
//     const data = { nowBlock: parseInt(startBlock, 10), endBlock, finished: false, transactions: [], numOfSend: {} };
//     fs.writeFileSync(filePath, JSON.stringify(data) , 'utf8');
//   }

//   res.json({})
// });

// router.get('/finished', async function (req, res, next) {
//   try {
//     const { contractAddress } = req.query;
  
//     const filePath = `${dataPath}/${contractAddress}.json`;
//     const existedFile = await fs.existsSync(filePath);
  
//     if (existedFile) {
//       let data = fs.readFileSync(filePath, 'utf8');
//       data = JSON.parse(data);
//       res.json({ finished: data.finished, nowBlock: data.nowBlock, endBlock: data.endBlock });
  
//     } else {
//       throw new Error('not register contractAddress');
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(400).json({ Error: e.message });
//   }
// })


router.post('/register', async function(req, res, next) {
  const { contractAddress, startBlock } = req.query;
  
  const latestBlock = await Service.Ethereum.getBlockNumber();
  const symbol = await Service.Ethereum.getSymbol(contractAddress);

  const existedSheet = await Service.GoogleSheet.existedSheet(symbol);
  if (!existedSheet) {
    await Service.GoogleSheet.createSheetInitScan(symbol, contractAddress, startBlock || 0, latestBlock);
  } else {
    const { endBlock } = await Service.GoogleSheet.getInfo(symbol);
    if (endBlock < latestBlock) {
      await Service.GoogleSheet.updateEndBlock(symbol, latestBlock);
    }
  }

  res.json({})
});

module.exports = router;
