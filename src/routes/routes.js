const { getUser } = require('../controllers/account/accounts');
const { getTrades } = require('../controllers/trade/alltrades');
const { getActive, getBank} = require('../controllers/trade/activetrade');
const { getOffer} = require('../controllers/offer/offer');


const router = require('express').Router();

router.get("/Api/getAccount", getUser);
router.get("/Api/getTrades", getTrades);
router.post("/Api/getActive", getActive);
router.post("/Api/getBank", getBank);
router.post("/Api/getOffer", getOffer);


module.exports = router;