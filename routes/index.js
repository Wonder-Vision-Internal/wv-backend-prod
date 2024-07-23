var express = require('express');
var router = express.Router();

var FrontRouter = require('./front');
var AdminRouter = require('./admin');


router.use('/front', FrontRouter);
router.use('/admin', AdminRouter);

module.exports = router;