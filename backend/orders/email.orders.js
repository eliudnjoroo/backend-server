require('dotenv').config();
const HOST_URL = process.env.LIVE_BACKEND_URL;

const Activity = require("../connection.js").activityColl
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

function generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const confirm_order_email_send = async (req, res) => {
    const { user, email_recieve, order, ext_order, cost } = req.query;
    let cool = (ext_order || "").trim();
    if (cool == "wow") {
        await resend.emails.send({
            from: 'electronics-ke <electronics.hello@3liud.org>',
            to: email_recieve,
            subject: `Email used for order confirmed`,
            html: `
                <h1>Hello ${user},</h1>
                <h2>confirmation for mail of the order being made by ${user} worth of sh.${cost}</h2>
                <h2>please login your account, go to profile and finish initiating the order</h2>
                <h2>If you did not initiate this order, you can ignore this email.</h2>
                <h2>Thank you!</h2>
            `
        })
            .then(async data => {
                console.log("data org: ", data)
                if( data.error ){
                    return res.status(422).json({ success: false });
                }
                await resend.emails.send({
                    from: 'electronics-ke <hello@3liud.org>',
                    to: process.env.ORGANIZATION_EMAIL,
                    subject: `Order placed by ${user} with ${email_recieve}`,
                    html: `
                <h1>Hello admin,</h1>
                <h2>confirmation for the order being made by ${user} worth of sh.${cost}</h2>
                <h2>Thank you!</h2>
            `
                })
                res.json({ success: true, data, toOrg: "yes" })
            })
            .catch(err => {
                console.error("Fallback Email Error: ", err);
                res.status(422).json({ success: false, err })
            })
        return;
    } 
    else {
        const token = generateToken({ user });
        console.log("token: " + token)
        try {
            const { data, error } = await resend.emails.send({
                from: 'electronics-ke <hello@3liud.org>',
                to: email_recieve,
                subject: 'Order placed Confirmation',
                html: `
                <h1>Hello ${user},</h1>
                <h2>confirmation for the order with the id ${ext_order} with cost of ${cost}</h2>
                <h3>Kindly confirm your recent order by clicking the link below:</h3>
                <h3><a href="${HOST_URL}/api/email/verify_order?token=${token}&user=${user}&_order=${order}">Confirm Order</a></h3>
                <h2>If you did not place this order, you can ignore this email.</h2>
                <h2>Thank you!</h2>
            `
            });

            if (error) {
                console.error('Resend Error:', error);
                return res.json({ success: false, error });
            }

            res.json({ success: true, data });
        } catch (err) {
            console.error(err);
            res.status(422).json({ success: false, error: err });
        }
    }
}

const verify_order_token = async (req, res) => {
    const { token, user, _order } = req.query
    if (!_order) {
        return;
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        await Activity.findOne({ user })
            .then(async res1 => {
                let now_orders = []
                res1.orders.pending.forEach(order => {
                    if (order.order_id == _order) {
                        console.log("id: ", _order)
                        const updated_order = {
                            order_id: order.order_id,
                            status: 1,
                            _id: order._id
                        }
                        now_orders.push(updated_order)
                    } else {
                        now_orders.push(order)
                    }
                })
                const new_orders = {
                    count: res1.orders.count,
                    orders: res1.orders.orders,
                    pending: now_orders,
                    delivrly: res1.orders.delivrly,
                    history: res1.orders.history
                }
                await Activity.findOneAndUpdate({ user }, { orders: new_orders }, { new: true })
                    .then(res2 => {
                        console.log("payload: " + JSON.stringify(payload));
                        res.sendFile(process.cwd() + "/views/verified.order.html")
                    })
            })
    } catch (err) {
        console.error('Invalid or expired token: ' + err);
        res.sendFile(process.cwd() + "/views/error.order.html")
    }
}

module.exports = { confirm_order_email_send, verify_order_token }