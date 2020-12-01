const fs = require('fs');
const path = require('path');
const localeEmoji = require('locale-emoji');
const { getUnicode } = require('countries-list');
// https://raw.githubusercontent.com/annexare/Countries/master/dist/data.json
const dataJSON = require('../lib/annexare-countries-data.json');
const languagesJSON = dataJSON.languages;



const temp = {};

const keys = Object.keys(languagesJSON).sort();
for (let i in keys) {
  const key = keys[i];
  const item = Object.assign({},
    { _id: key, },
    { code: key, },
    { emoji: localeEmoji(key), },
    { emoji_unicode: getUnicode(localeEmoji(key)), },
    { title: languagesJSON[key].name, },
    { title_native: languagesJSON[key].native, },
  );
  temp[key] = item;
}

const languages = {};
const keysSorted = Object.keys(temp).sort();
for (let i in keysSorted) {
  const key = keysSorted[i];
  languages[key] = temp[key];
}

const writeFile = false;
if (writeFile)
  fs.writeFileSync(
    path.resolve(__dirname, './languages.json'),
    JSON.stringify(languages, null, 2)
  );

module.exports = languages;
