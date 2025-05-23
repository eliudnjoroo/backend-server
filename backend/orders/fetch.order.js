const Activity = require("../connection.js").activityColl

const check_if_in_orders = (req, res) => {
    const { username } = req.params
    Activity.findOne({ user: username })
        .then(data => {
            let pending_arr = [];
            let delivery_arr = [];
            let history_arr = [];
            const pending = data.orders.pending.length;
            const delivery = data.orders.delivrly.length;
            const history = data.orders.history.length;
            if (pending > 0) {
                data.orders.pending.forEach(pend => {
                    const pend_id = pend.order_id
                    const pend_state = pend.status
                    pending_arr.push({pend_id, pend_state})
                });
            }
            if (delivery > 0) {
                data.orders.delivery.forEach(del => {
                    const del_id = del.order_id
                    const del_state = del.status
                    delivery_arr.push([del_id, del_state])
                });
            }
            if (history > 0) {
                data.orders.history.forEach(hist => {
                    const hist_id = hist.order_id
                    const hist_state = hist.status
                    history_arr.push([hist_id, hist_state])
                });
            }
            console.log(history)
            res.json({ pending, delivery, history, pending_arr, delivery_arr, history_arr });
        })
        .catch(err => {
            res.json({ fatError: err })
            console.log(err)
        })
}

const collect_if_in_orders = (req, res) => {
    const { username, order_id } = req.params
    Activity.findOne({ user: username }, { })
        .then(data => {
            let order_object = "not found"
            let unique_id = "not found"
            let date = "no date found"
            data.orders.orders.forEach( order => {
                if( order.order_id == order_id ){
                   order_object = order.snapshot
                   unique_id = order._id
                   date = order.date1
                }
            })
            res.json({ order_object, unique_id, date })
        })
        .catch(err => { 
            console.log( "fatest_Error: ", err )
            res.json({ fatest_Error: err })}
        )
}

module.exports = { check_if_in_orders, collect_if_in_orders }