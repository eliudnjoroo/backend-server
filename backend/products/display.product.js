const HOST_URL = process.env.LIVE_BACKEND_URL;

const Product = require("../connection.js").productColl

const get_products_for_display = async (req, res) => {
  await fetch(`${HOST_URL}/client`)
  await Product.find({})
    .then(products => {
      console.log("all products fetched")
      res.json({ allProducts: products })
    })
    .catch(err => res.json({ fatError: err }));
}

const get_product_for_display = async (req, res) => {
  await Product.find({ name: req.params.product_name })
    .then(product => {
      console.log(req.params.product_name+" fetched")
      res.json({ oneProduct: product })
    })
    .catch(err => res.json({ fatError: err }));
}

module.exports = { get_products_for_display, get_product_for_display }