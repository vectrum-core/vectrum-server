const express = require('express');
const router = express.Router();



const rates = [
  { symbol: 'VTM', price: '0.02', upOrDown: 'up', upOrDownPercent: '100' },
  { symbol: 'BTC', price: '37625.00', upOrDown: 'down', upOrDownPercent: '1.11' },
  { symbol: 'ETH', price: '1656.10', upOrDown: 'down', upOrDownPercent: '99.99' },
];

const makeRes = (arr) => {
  let i = 0;
  let res = {};
  while (i < arr.length) {
    res[arr[i].symbol] = arr[i];
    i++;
  }
  return res;
}

router.get('/',
  async (req, res, next) => {
    // TODO получать rates из БД
    const result = makeRes(rates);
    return res.json({ ok: true, result, });
  }
);


router.post('/',
  async (req, res, next) => {
    // TODO получать rates из БД
    const result = makeRes(rates);
    return res.json({ ok: true, result, });
  }
);


module.exports = router;
