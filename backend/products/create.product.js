// productController.js
require("dotenv").config();
const Product = require("../connection.js").productColl;
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// 1. Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Setup Multer + Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "products", // folder in your Cloudinary account
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});
const upload = multer({ storage });

// 3. Upload Middleware (for single image uploads only)
const save_image_to_system_middle_ware = upload.single("upfile");

// 4. Image Upload Handler
const save_image_to_system = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // req.file.path is the full hosted URL on Cloudinary
    res.json({
        success: true,
        message: "File uploaded",
        url: req.file.path,        // URL for frontend use
        public_id: req.file.filename // For future deletions if needed
    });
};

// 5. Create Product Handler
const create_new_valid_product = async (req, res) => {
    const { category, user, account, name, price, image, quantity, more, link, public_id } = req.body;

    const product = new Product({
        category,
        user,
        account,
        name,
        price,
        image, // this should be the Cloudinary URL
        quantity,
        more,
        link,
        public_id,
    });

    try {
        const saved = await product.save();
        res.json({ success: "true", name, detail: saved });
    } catch (err) {
        console.error("error saving product", err);
        res.json({ success: "false", name, error: err });
    }
};

module.exports = {
    save_image_to_system_middle_ware,
    save_image_to_system,
    create_new_valid_product,
};





//outdated
/*
const HOST_URL = "https://eliud-backend-server.onrender.com"

const Product = require("../connection.js").productColl
const multer = require('multer');
const path = require('path');

//configur stoage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb ) => {
        cb(null, "./backend/images/products/"); //folder to save
    },
    filename: (req, file, cb) => {
        cb(null, path.basename(file.originalname));
    }
})
const upload = multer({ storage: storage });

//for adding the product details in the database
const create_new_valid_product = async (req, res)=>{
    const { category, user, account, name, price, image, quantity, more, link } = req.body;
    const path = `${HOST_URL}`+image;
    const product = new Product({
        category,
        user,
        account,
        name,
        price,
        image: path,
        quantity,
        more,
        link,
    });
    product.save()
    .then(mess =>{
        res.json({ success: "true", name: name, detail: mess })
    })
    .catch(err => {
        console.log("error saving product"+err);
        res.json({ success: "false", name: name, error: err })
    });
}

//for adding product images to the file system
// route "/api/image/save"
//middleware
const save_image_to_system_middle_ware = upload.single("upfile");
//handler
const save_image_to_system = async( req, res) =>{
    if(!req.file){ return res.status(400).json({ success: false, message: "no file uploaded" }) }
    res.json({ success: true, message: "file uploaded", filename: req.file.filename })
}

module.exports = { create_new_valid_product, save_image_to_system, save_image_to_system_middle_ware }

*/