const te = require('./transferEvents');

test('aa', () => {
  const res = te.getUnFinishedToken();
  console.log(res);
});

test('ㅅㄱㅁ', async () => {
  await te.main();
}, 3000000)