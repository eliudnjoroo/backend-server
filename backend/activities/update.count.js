const Activity = require("../connection").activityColl;

const update_cart_item_count = async (req, res) => {
    const { user, product, action } = req.params;
    let new_cart_array;
    let index;
    await Activity.findOne({ user: user })
        .then(data => {
            new_cart_array = data.cart.map(( cart_product, i )=> {
                console.log(i)
                if (cart_product.product_name == product) {
                    index = i;
                    old_number = Number(cart_product.product_count)
                    const new_number = action == "plus" ? old_number + 1 : old_number - 1;
                    return { product_name: product, product_count: new_number }
                } else {
                    return cart_product
                }
            })
        })
    await Activity.findOneAndUpdate(
        { user: user },
        { cart: new_cart_array },
        { new: true }
    )
        .then( result => {
            res.json({ result, index })
        })
        .catch(err => { res.json({ error: err }) })
}

const clear_cart = async (req, res) => {
    const { user } = req.params;
    await Activity.findOneAndUpdate({ user: user }, { cart: [] }, { new: true })
        .then(data => {
            res.json({ success: "true", data: data })
            return;
        })
        .catch(err => { res.json({ error: err, success: "false" }) })
}

module.exports = { update_cart_item_count, clear_cart }