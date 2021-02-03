const express = require('express');
const Service = require('../services');
const _ = require('underscore');

const models = require('../models');

const router = express.Router();

router.post('/register/:contractAddress', async (req, res, next) => {
  const { contractAddress } = req.params;
  const { startBlock } = req.query;
  
  const exist = await models.Token.findOne({
    where: {
      contractAddress,
    }
  })

  if (!_.isNull(exist)) {
    await models.Token.create({
      contractAddress,
      blockHeight: startBlock,
      process: 1,
    })
  }
  res.json({})
});

router.get('/state/:contractAddress', async (req, res, next) => {
  const { contractAddress } = req.params;

  const state = await models.Token.findOne({
    where: {
      contractAddress,
    },
  }) 

  let result = {
    contractAddress,
    symbol: null,
    blockHeight: null,
    process: false,
  }
  
  if (!_.isNull(state)) {
    result.symbol = state.get('symbol');
    result.blockHeight = state.get('blockHeight');
    result.process = state.get('process');
  }

  return res.json(result)
})

router.post('/xlsx/tokenHolder/:contractAddress', async (req, res, next) => {
  const { contractAddress } = req.params;

  const data = await models.TokenHolder.findAll({
    where: {
      contractAddress,
    },
    attributes: [
      ['address', '주소'], 
      ['num_of_send', '보낸 횟수'],
      ['num_of_receive', '받은 횟수']
    ],
    raw: true,
  });

  const wb = await Service.Xlsx.objectArrayToXlsx(data);
  const buf = await Service.Xlsx.xlsxToBuffer(wb);
  res.attachment(`${contractAddress}.xlsx`);
  return res.send(buf);
})

module.exports = router;
