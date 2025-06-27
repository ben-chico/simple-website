const express = require('express');
const router = express.Router();
const { uploadImage, getAllImages, getMyImages, deleteImage } = require('../controllers/imageController');
const { homeMiddleware, adminMiddleware } = require('../middlewares/home-admin-middleware');
const upload = require('../middlewares/upload');

// 🔼 Upload (admin uniquement)
router.post('/upload', homeMiddleware, adminMiddleware, upload.single('image'), uploadImage);

// 📥 Lire toutes les images (user et admin)
router.get('/', homeMiddleware, getAllImages);

// 📥 Lire ses images (admin uniquement)
router.get('/mine', homeMiddleware, adminMiddleware, getMyImages);

// ❌ Supprimer une image (admin uniquement, si c’est lui qui l’a uploadée)
router.delete('/:id', homeMiddleware, adminMiddleware, deleteImage);

module.exports = router;
