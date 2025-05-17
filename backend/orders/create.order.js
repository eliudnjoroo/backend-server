const Activity = require("../connection.js").activityColl

const create_new_order = (req, res) => {
    const { username, date, quantity, total, discount, net, tax, cost, location, contacts } = req.params;
    console.log("location.country: ",location.split("~~~")[0])
    const location101 = {
        country: location.split("~~~")[0],
        county: location.split("~~~")[1],
        town: location.split("~~~")[2],
        stage: location.split("~~~")[3],
    }
    const contacts101 = {
        cust_phone: contacts.split("~~~")[0],
        cust_email: contacts.split("~~~")[1],
    }
    Activity.findOne({ user: username })
        .then(data => {
            let order_id1 = data.orders.orders.length + 1;
            console.log("order_id: " + order_id1)
            const raw_order = data.cart
            const new_order = {
                order_id: order_id1,
                date1: date,
                snapshot: {
                    quantity: quantity,
                    total: total,
                    discount: discount,
                    net: net,
                    tax: tax,
                    cost: cost,
                    location: location101,
                    contacts: contacts101,
                },
                items: raw_order,
            }
            const new_pending = {
                order_id: order_id1,
                status: "not-approved",
            }
            const actual_order = [...data.orders.orders, new_order]
            const pending_order = [...data.orders.pending, new_pending]
            Activity.findOneAndUpdate(
                { user: username },
                {
                    orders: {
                        count: order_id1,
                        orders: actual_order,
                        pending: pending_order
                    },
                    cart: []
                },
                { new: true }
            )
                .then(response => res.json({ response }))
                .catch(err => {
                    res.json({ fatError1: err })
                    console.log("err1: " + err)
                })
        })
        .catch(err => {
            res.json({ fatError2: err })
            console.log("err2: " + err)
        })
}

const cancel_old_order = (req, res) => {
    const { username, order_id } = req.params
    Activity.findOne({ user: username })
        .then()
        .catch(err => res.json({ fatError: err }))
}

module.exports = { create_new_order, cancel_old_order }