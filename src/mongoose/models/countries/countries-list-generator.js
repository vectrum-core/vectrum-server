const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const { getUnicode } = require('countries-list');
// https://raw.githubusercontent.com/annexare/Countries/master/dist/data.json
const dataJSON = require('../lib/annexare-countries-data.json');
const countriesJSON = dataJSON.countries;


const temp = {};

const keys = Object.keys(countriesJSON);
for (let i in keys) {
  const key = keys[i];
  const item = Object.assign({},
    { _id: key, },
    { code: key, },
    { title: countriesJSON[key].name, },
    { title_native: countriesJSON[key].native, },
    { emoji: countriesJSON[key].emoji, },
    { emoji_unicode: getUnicode(countriesJSON[key].emoji), },
    { continent: countriesJSON[key].continent, },
    { capital: countriesJSON[key].capital, },
    { phone: countriesJSON[key].phone, },
    { currencies: countriesJSON[key].currency.split(','), },
    { languages: countriesJSON[key].languages, },
    { timezones: moment.tz.zonesForCountry(key), },
  );
  temp[key] = item;
}

const countries = {};
const keysSorted = Object.keys(temp).sort();
for (let i in keysSorted) {
  const key = keysSorted[i];
  countries[key] = temp[key];
}

const writeFile = false;
if (writeFile)
  fs.writeFileSync(
    path.resolve(__dirname, './countries.json'),
    JSON.stringify(countries, null, 2)
  );

module.exports = countries;
