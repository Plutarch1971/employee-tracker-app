const router = require('express').Router();

const businessRouter = require('./business.router');

router.use('/business', businessRouter);


module.exports = router;