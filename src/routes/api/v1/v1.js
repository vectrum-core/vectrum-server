const express = require('express');
const router = express.Router();
const pingRouter = require('./ping');
const userRouter = require('./user');



router.use('/ping', pingRouter);
router.use('/user', userRouter);


module.exports = router;
