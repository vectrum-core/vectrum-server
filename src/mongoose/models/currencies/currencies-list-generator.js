const fs = require('fs');
const path = require('path');
// https://gist.github.com/Fluidbyte/2973986
const currenciesFiats0JSON = require('./currencies-fiats-0.json');
// https://core.telegram.org/bots/payments/currencies.json
const currenciesFiats1JSON = require('./currencies-fiats-1.json');
const currenciesCoinsJSON = require('./currencies-coins.json');
const currenciesTokensJSON = require('./currencies-tokens.json');


const temp = {};
let keys = [];

keys = Object.keys(currenciesFiats0JSON).sort();
for (let i in keys) {
  const key = keys[i];
  const item = Object.assign({},
    { _id: currenciesFiats0JSON[key].code, },
    { code: currenciesFiats0JSON[key].code, },
    { decimals: currenciesFiats0JSON[key].decimal_digits, },
    { symbol: currenciesFiats0JSON[key].symbol, },
    { symbol_native: currenciesFiats0JSON[key].symbol_native, },
    { title: currenciesFiats0JSON[key].name, },
    { is_fiat: true, },
  );
  temp[key] = item;
}

keys = Object.keys(currenciesFiats1JSON).sort();
for (let i in keys) {
  const key = keys[i];
  const item = Object.assign({},
    { _id: currenciesFiats1JSON[key].code, },
    { code: currenciesFiats1JSON[key].code, },
    { decimals: currenciesFiats1JSON[key].exp, },
    { symbol: currenciesFiats1JSON[key].symbol, },
    { symbol_native: currenciesFiats1JSON[key].native, },
    { title: currenciesFiats1JSON[key].title, },
    { thousands_sep: currenciesFiats1JSON[key].thousands_sep, },
    { decimal_sep: currenciesFiats1JSON[key].decimal_sep, },
    { symbol_left: currenciesFiats1JSON[key].symbol_left, },
    { space_between: currenciesFiats1JSON[key].space_between, },
    { is_fiat: true, },
  );
  temp[key] = item;
}

keys = Object.keys(currenciesCoinsJSON).sort();
for (let i in keys) {
  const key = keys[i];
  const item = Object.assign({},
    { _id: currenciesCoinsJSON[key].code, },
    { code: currenciesCoinsJSON[key].code, },
    { decimals: currenciesCoinsJSON[key].decimals, },
    { symbol: currenciesCoinsJSON[key].symbol, },
    { symbol_native: currenciesCoinsJSON[key].symbol_native, },
    { title: currenciesCoinsJSON[key].title, },
    { thousands_sep: currenciesCoinsJSON[key].thousands_sep, },
    { decimal_sep: currenciesCoinsJSON[key].decimal_sep, },
    { symbol_left: currenciesCoinsJSON[key].symbol_left, },
    { space_between: currenciesCoinsJSON[key].space_between, },
    { is_coin: true, },
  );
  temp[key] = item;
}

keys = Object.keys(currenciesTokensJSON).sort();
for (let i in keys) {
  const key = keys[i];
  const item = Object.assign({},
    { _id: currenciesTokensJSON[key].code, },
    { code: currenciesTokensJSON[key].code, },
    { decimals: currenciesTokensJSON[key].decimals, },
    { symbol: currenciesTokensJSON[key].symbol, },
    { symbol_native: currenciesTokensJSON[key].symbol_native, },
    { title: currenciesTokensJSON[key].title, },
    { thousands_sep: currenciesTokensJSON[key].thousands_sep, },
    { decimal_sep: currenciesTokensJSON[key].decimal_sep, },
    { symbol_left: currenciesTokensJSON[key].symbol_left, },
    { space_between: currenciesTokensJSON[key].space_between, },
    { is_token: true, },
  );
  temp[key] = item;
}

const currencies = {};
const keysSorted = Object.keys(temp).sort();
for (let i in keysSorted) {
  const key = keysSorted[i];
  currencies[key] = temp[key];
}

const writeFile = false;
if (writeFile)
  fs.writeFileSync(
    path.resolve(__dirname, './currencies.json'),
    JSON.stringify(currencies, null, 2)
  );

module.exports = currencies;
