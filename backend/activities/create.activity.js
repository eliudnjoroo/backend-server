const Activity = require("../connection.js").activityColl

const create_activity_new_user = async (req, res) => {
    const very_new_activity = new Activity({
        user: req.params.username,
    })
    very_new_activity.save()
        .then(act => { res.json({ success: "true", action: act }) })
        .catch(err => { res.json({ success: "false", error: err }) });
}

const check_if_in_cart = (req, res) => {
    const { active_user, item } = req.params
    Activity.findOne({ user: active_user })
        .then((data) => {
            let available = "no";
            if (data.cart) {
                data.cart.forEach(found_item => {
                    if (found_item.product_name == item) {
                        available = "yess"
                    }
                });
            }
            res.json({ present: available })
        })
        .catch(err => { res.json({ success: "full false", error: err }) })
}

const add_cart_activity = (req, res) => {
    const { active_user, item, count } = req.params
    let details_arr = [];
    Activity.findOne({ user: active_user })
        .then((data) => {
            if (data.cart) { details_arr = data.cart; }
            const details = {
                product_name: item,
                product_count: count
            }
            details_arr.push(details);
            Activity.findOneAndUpdate({ user: active_user }, { cart: details_arr }, { new: true })
                .then(db_res => { res.json({ success: "true", results: db_res }) })
                .catch(err => { res.json({ success: "false", error: err }) })
        })
        .catch(err => { res.json({ success: "full false", error: err }) })
}

const remove_cart_activity = (req, res) => {
    const { active_user, item } = req.params
    let details_arr = [];
    Activity.findOne({ user: active_user })
        .then((data) => {
            if (data.cart) {
                details_arr = data.cart.filter(product => {
                    return product.product_name == item ? null : product;
                })
            }
            Activity.findOneAndUpdate({ user: active_user }, { cart: details_arr }, { new: true })
                .then(db_res => { res.json({ success: "true", results: db_res }) })
                .catch(err => { res.json({ success: "false", error: err }) })
        })
        .catch(err => { res.json({ success: "full false", error: err }) })
}

module.exports = { create_activity_new_user, add_cart_activity, remove_cart_activity, check_if_in_cart }