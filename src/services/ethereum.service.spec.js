const ethereumService =require('./ethereum.service');


function yyyymmdd(timestamp) {
  const d = new Date(timestamp * 1000);
  return d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);  
}
test('ethereumService', async () => {
  const height = 101;
  const res = await ethereumService.getBlock(height)
  console.log(res);

  console.log(yyyymmdd(res.timestamp))
})

