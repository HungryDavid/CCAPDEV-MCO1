const express = require('express');
const router = express.Router();
const controller = require('./labs-controller');

router.get('/', controller.getSlotsAvailabilityPage);

module.exports = router;