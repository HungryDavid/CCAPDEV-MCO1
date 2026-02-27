const multer = require('multer');
const path = require('path');

// Configure Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Files will be saved in 'public/uploads'
        cb(null, path.join(__dirname, '../../client/uploads/'));
    },
    filename: function (req, file, cb) {
        // Rename file to: user-{id}-{timestamp}.ext (e.g., user-123-9999.jpg)
        // This prevents filename conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'user-' + req.session.userId + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File Filter (Optional: Accept only images)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit 5MB
    fileFilter: fileFilter
});

module.exports = upload;