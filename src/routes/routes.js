const { getUser } = require('../controllers/account/accounts');
const { getTrades } = require('../controllers/trade/alltrades');

const router = require('express').Router();

router.get("/Api/getAccount", getUser);
router.get("/Api/getTrades", getTrades);


module.exports = router;