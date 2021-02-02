const schedule = require('node-schedule');

const { job } = require('./transferEvents'); 

schedule.scheduleJob('*/10 * * * * *', job);
