const express = require('express');
const router = express.Router();
const controller = require('../controllers/my-reservations-controller');
const { authorize } = require('../middleware/auth-middleware');

//router.get('/', authorize('student'), controller.getPage);

module.exports = router;