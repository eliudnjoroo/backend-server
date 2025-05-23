const mongoose = require('mongoose');
require('dotenv').config();

const categoryScema = new mongoose.Schema({
    category_name: { type: String, required: true, unique: true }
}, { timestamps: true })
const categoryColl = new mongoose.model("Category", categoryScema);

const activitySchema = new mongoose.Schema({
    user: { type: String, required: true, unique: true },
    fav: [{ type: String, required: true, default: "nothing" }],
    wish: [{ type: String, required: true, default: "nothing" }],
    cart: [{
        product_name: { type: String, required: true, default: "nothing" },
        product_count: { type: Number, required: true, default: 0 },
    }],
    orders: {
        count: { type: Number, required: true, default: 0 },
        orders: [{
            order_id: { type: Number, required: true, default: 0 },
            date1: { type: String, required: true, default: "nothing" },
            date2: { type: String, required: true, default: "nothing" },
            date3: { type: String, required: true, default: "nothing" },
            snapshot: {
                quantity: { type: Number, required: true, default: 0 },
                total: { type: Number, required: true, default: 0 },
                discount: { type: Number, required: true, default: 0 },
                net: { type: Number, required: true, default: 0 },
                tax: { type: Number, required: true, default: 0 },
                cost: { type: Number, required: true, default: 0 },
                location: {
                    country: { type: String, required: true, default: 0 },
                    county: { type: String, required: true, default: 0 },
                    town: { type: String, required: true, default: 0 },
                    stage: { type: String, required: true, default: 0 },
                },
                contacts: {
                    cust_phone: { type: String, required: true, default: 0 },
                    cust_email: { type: String, required: true, default: 0 },
                },
            },
            items: [{
                product_name: { type: String, required: true, default: "nothing" },
                product_count: { type: String, required: true, default: "nothing" },
            }],
        }],
        pending: [{
            order_id: { type: String, required: true, default: "nothing" },
            status: { type: Number, required: true, default: 0 }
        }],
        delivrly: [{
            _id: { type: String, required: true, default: "nothing" },
            date2: { type: String, required: true, default: "nothing" },
            status: { type: Number, required: true, default: 0 }
        }],
        history: [{
            order: { type: String, required: true, default: "nothing" },
            date3: { type: String, required: true, default: "nothing" },
            status: { type: Number, required: true, default: 0 }
        }]
    }
})
const activityColl = new mongoose.model("Activity", activitySchema);


const productSchema = new mongoose.Schema({
    category: { type: String, required: true },
    user: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true, default: "no image" },
    public_id: { type: String, required: true, default: "no public id" },
    more: {
        name: { type: String, required: true },
        info1: [{ type: String, required: true }],
        info2: [{ type: String, required: true }],
        link: { type: String, default: "no link" },
    }
}, { timestamps: true });
const productColl = mongoose.model("Productdata", productSchema);


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    acc_type: { type: String, required: true, default: "customer" },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    number: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: { type: String, required: true },
    logged: { type: Boolean, required: true, default: false },
    last_login: { type: String, required: true, default: "Never logged in" },
    last_logout: { type: String, required: true, default: "Never logged out" },
    last_update: { type: String, required: true, default: new Date() },
}, { timestamps: true });
const userColl = mongoose.model("Userdata", userSchema);


mongoose.connect(process.env.CONNECTION_URI)
    .then(async () => {
        console.log("mongodb connected successfully.")
        await Promise.all([
            categoryColl.init(),
            activityColl.init(),
            productColl.init(),
            userColl.init()
        ]);
    })
    .catch((err) => {
        console.log("ERR: mongodb not connected successfully" + err)
    });


module.exports = { userColl, productColl, activityColl, categoryColl }