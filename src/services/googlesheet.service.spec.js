const { getInfo } = require('./googlesheet.service')


test('getNowBlock', async () => {
  const res = await getInfo('USDT')
  console.log(res);
})
