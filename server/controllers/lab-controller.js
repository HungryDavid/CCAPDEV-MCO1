const User = require('../models/User');

exports.createLab = catchAsync(async (req, res, next) => {
  // Controller delegates DB work to the Service
  const newLab = await labService.createLab(req.body);

  res.status(201).json({
    status: 'success',
    data: { lab: newLab }
  });
});

// 2. READ ALL
exports.getAllLabs = catchAsync(async (req, res, next) => {
  const labs = await labService.getAllLabs(req.query);

  res.status(200).json({
    status: 'success',
    results: labs.length,
    data: { labs }
  });
});

// 3. READ ONE
exports.getLab = catchAsync(async (req, res, next) => {
  const lab = await labService.getLabById(req.params.id);

  if (!lab) {
    return next(new AppError('No laboratory found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { lab }
  });
});

// 4. UPDATE
exports.updateLab = catchAsync(async (req, res, next) => {
  const lab = await labService.updateLab(req.params.id, req.body);

  if (!lab) {
    return next(new AppError('No laboratory found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { lab }
  });
});

// 5. DELETE
exports.deleteLab = catchAsync(async (req, res, next) => {
  const lab = await labService.deleteLab(req.params.id);

  if (!lab) {
    return next(new AppError('No laboratory found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
