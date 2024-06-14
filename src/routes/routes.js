const { getUser } = require('../controllers/account/accounts');
const { getTrades } = require('../controllers/trade/alltrades');
const { getActive} = require('../controllers/trade/activetrade');

const router = require('express').Router();

router.get("/Api/getAccount", getUser);
router.get("/Api/getTrades", getTrades);
router.get("/Api/getActive", getActive);


module.exports = router;