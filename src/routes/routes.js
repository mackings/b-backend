const { getUser } = require('../controllers/account/accounts');
const { getTrades } = require('../controllers/trade/alltrades');
const { getActive, getBank, webhook} = require('../controllers/trade/activetrade');
const { getOffer , getOffers} = require('../controllers/offer/offer');


const router = require('express').Router();

router.get("/Api/getAccount", getUser);
router.get("/Api/getTrades", getTrades);
router.post("/Api/getActive", getActive);
router.post("/Api/getBank", getBank);
router.post("/Api/getOffer", getOffer);
router.post("/Api/getOffers", getOffers);
router.post("/paxful/webhook",webhook);


module.exports = router;