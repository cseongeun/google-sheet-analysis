const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const config = require('../config').mysql;

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);


fs.readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize)
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.options.logging = false;
// force sync
// sequelize
  // .sync()
  // .then(() => {
  //   console.log('✓ DB connection success.');
  //   console.log('  Press CTRL-C to stop\n');
  // })
  // .catch((err) => {
  //   console.error(err);
  //   console.log('✗ DB connection error. Please make sure DB is running.');
  //   process.exit();
  // });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
