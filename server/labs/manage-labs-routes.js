const upload = require('../middleware/upload'); // Import middleware


const express = require('express');
const router = express.Router();
const controller = require('./labs-controller');
const { authorize } = require('../middleware/auth-middleware');


authorize('technician');
router.post('/create', controller.createLab);
router.get('/edit/:id', controller.getLabById);
router.post('/edit/:id', controller.updateLab);
router.post('/delete/:id', controller.deleteLab);
router.get('/', controller.getPage);
module.exports = router;