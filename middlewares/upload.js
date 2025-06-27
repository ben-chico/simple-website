const multer = require('multer');
const path = require('path');

// Configuration mémoire (pas de stockage disque car Cloudinary est en cloud)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, JPEG, and PNG files are allowed'), false);
    }
};


const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter
});

module.exports = upload;