const express = require('express');
const fs = require('fs');

const { dataPath } = require('../config');
const { getBlockNumber } = require('../lib/eth');

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

  const endBlock = await getBlockNumber();
  
  const existedSheet = await fs.(filePath);
  if (existedFile) {
    let data = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(data);
    data.endBlock = endBlock;
    data.finished = false;
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
  } else {
    const data = { nowBlock: parseInt(startBlock, 10), endBlock, finished: false, transactions: [], numOfSend: {} };
    fs.writeFileSync(filePath, JSON.stringify(data) , 'utf8');
  }

  res.json({})
});

router.get('/finished', async function (req, res, next) {
  try {
    const { contractAddress } = req.query;
  
    const filePath = `${dataPath}/${contractAddress}.json`;
    const existedFile = await fs.existsSync(filePath);
  
    if (existedFile) {
      let data = fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(data);
      res.json({ finished: data.finished, nowBlock: data.nowBlock, endBlock: data.endBlock });
  
    } else {
      throw new Error('not register contractAddress');
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ Error: e.message });
  }
})


module.exports = router;
