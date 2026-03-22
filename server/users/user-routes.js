const upload = require('../middleware/upload');


const express = require('express');
const router = express.Router();
const controller = require('./user-controller');
const { authorize } = require('../middleware/auth-middleware');

authorize('student','technician');

router.get('/me', controller.getCurrentUserProfile)
router.post('/me/edit', upload.single('profilePic'), controller.updateProfile)
router.post('/me/delete', controller.deleteProfile)
router.get('/search', controller.searchUser)
module.exports = router;