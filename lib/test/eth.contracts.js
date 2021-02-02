const { getEvents }  = require('../eth/contracts');


describe('getEvents', () => {
  it('럭스바이오 이벤트', async (done) => {
    const LUXBIO_CONTRACT_ADDRESS = '0xffe510a92434a0df346c5e72a3494b043cf249eb';
    const startBlock = 11770263;
    
    getEvents(LUXBIO_CONTRACT_ADDRESS, startBlock).then((result) => console.log(result)).catch(done)
  })
})