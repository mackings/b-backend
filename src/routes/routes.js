const { getUser } = require('../controllers/account/accounts');

const router = require('express').Router();

router.get("/Api/getAccount", getUser);


module.exports = router;