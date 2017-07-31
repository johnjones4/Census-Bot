const ProgressBar = require('progress');
const fs = require('fs-extra');
const async = require('async');
const database = require('./database');
const consts = require('./consts');

exports.import = (file) => {
  return fs.readFile(file,'utf-8')
    .then((contents) => {
      return new Promise((resolve,reject) => {
        const lines = contents.split('\n');
        const q = async.queue((line,done) => {
          const record = {};
          for(const column in consts.columns) {
            const rawValue = line.substring(consts.columns[column][0]-1,consts.columns[column][1]);
            const type = consts.types[column];
            if (typeof type == 'string') {
              switch(type) {
                case 'int':
                  record[column] = parseInt(rawValue);
                  if (record[column] === -1) {
                    record[column] = null;
                  }
                  break;
                case 'float':
                  record[column] = parseFloat(rawValue);
                  if (record[column] === -1) {
                    record[column] = null;
                  }
                  break;
                default:
                  record[column] = rawValue;
                  break;
              }
            } else {
              const parsedValue = type(rawValue);
              if (typeof parsedValue == 'object') {
                for(columnSuffix in parsedValue) {
                  record[column + '_' + columnSuffix] = parsedValue[columnSuffix];
                }
              } else {
                record[column] = parsedValue;
              }
            }
          }
          if (record.HRHHID === '') {
            done();
          } else {
            database.insert(record).asCallback(done);
          }
        },10);
        const bar = new ProgressBar('Processing :current of :total (:percent)', { total: lines.length });
        q.drain = () => {
          console.log('\n');
          resolve();
        };
        q.push(lines,(err) => {
          bar.tick();
          if (err) {
            reject(err);
          }
        });
      });
    });
}
