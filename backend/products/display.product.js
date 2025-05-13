const Product = require("../connection.js").productColl

const get_products_for_display = async (req, res) => {
  await Product.find({})
    .then(products => res.json({ allProducts: products }))
    .catch(err => res.json({ fatError: err }));
}

const get_product_for_display = async (req, res) => {
  console.log("get_product_for_display: ",req.params.product_name)
  await Product.find({ name: req.params.product_name })
    .then(product => res.json({ oneProduct: product }))
    .catch(err => res.json({ fatError: err }));
}

module.exports = { get_products_for_display, get_product_for_display }