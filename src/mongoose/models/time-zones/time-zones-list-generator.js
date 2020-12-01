const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');



const time = new Date('2021-01-01T00:00:00.000Z'); // Date.now();
const docs = {};
const names = moment.tz.names();

for (let i in names) {
  const zone = moment.tz.zone(names[i]);
  const obj = {};
  obj._id = names[i];
  //obj.name = names[i];
  obj.title = names[i];
  obj.code = moment.tz(names[i]).zoneAbbr();
  obj.offset = zone.parse(time);

  docs[names[i]] = obj;
}

const writeFile = false;
if (writeFile)
  fs.writeFileSync(
    path.resolve(__dirname, './time-zones.json'),
    JSON.stringify(docs, null, 2)
  );

module.exports = docs;
