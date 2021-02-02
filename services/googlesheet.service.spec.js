const { existedSheet, createSheet, createSheetInitScan, updateCell } = require('./googlesheet.service')


test('existedSheet', async () => {
  const res = await existedSheet('시트1')
  console.log(res);
})

test('createSheet', async () => {
  const res = await createSheet('시트2')
})

test('createSheetInitScan', async () => {
  const res = await createSheetInitScan('시트4', 1000, 100123);
})

test('updateCell', async () => {
  const res = await updateCell('시트4', [3, 1], '1123123213');
})