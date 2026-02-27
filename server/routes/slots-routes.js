const express = require('express');
const router = express.Router();
const controller = require('../controllers/slotsController');
const { ensureAuth } = require('../middleware/auth-middleware');

router.get('/', controller.getPage);

module.exports = router;