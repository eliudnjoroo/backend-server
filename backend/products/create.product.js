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
    const path = "https://localhost:1000//"+image;
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