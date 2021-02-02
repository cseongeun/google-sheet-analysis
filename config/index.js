const path = require('path');

module.exports = {
  endPoint: {
    mainnet: 'https://mainnet.infura.io/v3/40a8cb5b9d854cb79b0a1c1f84ee7d2b',
  },
  googlesheetId: '1h-kHUvhyBVS8ArYRpRl6g6u3gojzhiX6-U96UMnSa5g',
  dataPath: path.resolve(`${__dirname}/../DATA`),
  chunkSize: 500,
}