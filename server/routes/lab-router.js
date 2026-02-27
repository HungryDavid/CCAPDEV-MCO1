const express = require('express');
const router = express.Router();
const controller = require('../controllers/lab-controller');

router
  .route('/')
  .get(controller.getAllLabs)   // GET /api/v1/labs
  .post(controller.createLab);  // POST /api/v1/labs

router
  .route('/:id')
  .get(controller.getLab)       // GET /api/v1/labs/65f2...
  .patch(controller.updateLab)  // PATCH /api/v1/labs/65f2...
  .delete(controller.deleteLab); // DELETE /api/v1/labs/65f2...

module.exports = router;