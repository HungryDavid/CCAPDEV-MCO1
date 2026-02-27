const upload = require('../middleware/upload'); // Import middleware


const express = require('express');
const router = express.Router();
const controller = require('../controllers/manage-labs-controller');
const { authorize } = require('../middleware/auth-middleware');


authorize('technician');
router.post('/create', controller.createLab);
router.get('/', controller.getPage);
router.get('/edit/:id', controller.getLabById);
router.post('/edit/:id', controller.updateLab);
router.post('/delete/:id', controller.deleteLab);
module.exports = router;