const express = require('express');
const router = express.Router();



router.get('/',
  async (req, res, next) => {
    return res.json({ ok: true, result: 'pong', });
  }
);


router.post('/',
  async (req, res, next) => {
    return res.json({ ok: true, result: 'pong', });
  }
);


module.exports = router;
