const cloudinary = require('../utils/cloudinary');
const Image = require('../model/image');

// 🔼 Upload image (ADMIN uniquement)
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Envoi à Cloudinary
        const result =  cloudinary.uploader.upload_stream(
            {
                folder: 'uploads',
                resource_type: 'image'
            },
            async (error, result) => {
                if (error) return res.status(500).json({ message: 'Cloudinary error', error });

                const image = new Image({
                    url: result.secure_url,
                    public_id: result.public_id,
                    addedBy: req.userInfo.id // utilisateur connecté (admin)
                });

                await image.save();
                res.status(201).json({ message: "Image uploaded ✅", data: image });
            }
        );

        // on lit le buffer du fichier avec Cloudinary stream
        result.end(req.file.buffer);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal error ❌" });
    }
};

// 📥 Lire toutes les images (tous les rôles)
const getAllImages = async (req, res) => {
    try {
        const images = await Image.find().populate('addedBy', 'username  role');
        res.status(200).json({ data: images });
    } catch (err) {
        res.status(500).json({ message: "Internal error ❌" });
    }
};

// 📥 Lire ses propres images (ADMIN uniquement)
const getMyImages = async (req, res) => {
    try {
        const images = await Image.find({ addedBy: req.userInfo.id });
        if(images.length > 0){
            res.status(200).json({ data: images });
        }else{
            res.status(400).json({
                message: "you haven't uploaded any image"
            })
        }
    } catch (err) {
        res.status(500).json({ message: "Internal error ❌" });
    }
};

// ❌ Supprimer image (ADMIN seulement)
const deleteImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        // Vérifie que c’est bien l’admin qui a ajouté l’image
        if (image.addedBy.toString() !== req.userInfo.id) {
            return res.status(403).json({ message: "Unauthorized ❌" });
        }

        // Supprimer sur Cloudinary
        await cloudinary.uploader.destroy(image.public_id);

        // Supprimer dans MongoDB
        await image.deleteOne();

        res.status(200).json({ message: "Image deleted ✅" });
    } catch (err) {
        res.status(500).json({ message: "Internal error ❌" });
    }
};

module.exports = {
    uploadImage,
    getAllImages,
    getMyImages,
    deleteImage
};
