const fs = require('fs');
const path = require('path');
// https://raw.githubusercontent.com/annexare/Countries/master/dist/data.json
const dataJSON = require('../lib/annexare-countries-data.json');
const continentsJSON = dataJSON.continents;


const temp = {};

const keys = Object.keys(continentsJSON);
for (let i in keys) {
  const key = keys[i];
  const item = Object.assign({},
    { _id: key, },
    { code: key, },
    { title: continentsJSON[key], },
  );
  temp[key] = item;
}

const continents = {};
const keysSorted = Object.keys(temp).sort();
for (let i in keysSorted) {
  const key = keysSorted[i];
  continents[key] = temp[key];
}

const writeFile = false;
if (writeFile)
  fs.writeFileSync(
    path.resolve(__dirname, './continents.json'),
    JSON.stringify(continents, null, 2)
  );

module.exports = continents;
