const Product = require("../connection").activityColl

const get_all_in_cart = async(req, res) => {
    const { active_user } = req.params;
    console.log("username: ",active_user);
    Product.find({ user: active_user })
    .then( db_res => {
        res.json({ success: "true", data: db_res })
        console.log("all products: ",db_res);
    })
    .catch( err => { res.json({ success: "false", error: err})})
}

module.exports = { get_all_in_cart }