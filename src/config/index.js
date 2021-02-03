const path = require('path');

module.exports = {
  endPoint: {
    mainnet: 'https://mainnet.infura.io/v3/40a8cb5b9d854cb79b0a1c1f84ee7d2b',
  },
  googlesheetId: '1h-kHUvhyBVS8ArYRpRl6g6u3gojzhiX6-U96UMnSa5g',
  dataPath: path.resolve(`${__dirname}/../DATA`),
  chunkSize: 500,
  mysql: {
    username: 'root',
    password: 'qwer1234',
    database: 'mini-hexscan',
    port: 3306,
    host: 'localhost',
    dialect: 'mysql',

    pool: {
      max: 20,
      min: 0,
      acquire: 60000,
      idle: 20000,
    },
  } 
}