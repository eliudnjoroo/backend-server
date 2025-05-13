const mongoose = require('mongoose');
require('dotenv').config();


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
            _id: { type: String, required: true, default: "nothing" },
            number: { type: Number, required: true, default: 0 },
            date1: { type: String, required: true, default: "nothing" },
            date2: { type: String, required: true, default: "nothing" },
            date3: { type: String, required: true, default: "nothing" },
            items: [{
                product_name: { type: String, required: true, default: "nothing" },
                product_count: { type: String, required: true, default: "nothing" },
            }],
        }],
        pending: [{
            _id: { type: String, required: true, default: "nothing" },
            status: { type: String, required: true, default: "nothing" }
        }],
        delivrly: [{
            _id: { type: String, required: true, default: "nothing" },
            date2: { type: String, required: true, default: "nothing" },
            status: { type: String, required: true, default: "nothing" }
        }],
        history: [{
            order: { type: String, required: true, default: "nothing" },
            date3: { type: String, required: true, default: "nothing" },
            status: { type: String, required: true, default: "nothing" }
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
    category: { type: String, required: true, default: "main products" },
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
    .then(() => {
        console.log("mongodb connected successfully to users database.")
    })
    .catch((err) => {
        console.log("ERR: mongodb not connected successfully" + err)
    });


module.exports = { userColl, productColl, activityColl }