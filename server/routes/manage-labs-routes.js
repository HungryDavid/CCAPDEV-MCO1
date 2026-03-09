const upload = require('../middleware/upload'); // Import middleware


const express = require('express');
const router = express.Router();
const controller = require('../labs/labs-controller');
const { authorize } = require('../middleware/auth-middleware');



module.exports = router;