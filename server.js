const express = require('express');
const cors = require('cors');
const app = express();
const https = require('https');  // ① for creating the HTTPS server
const fs = require('fs');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const { verify_new_email, complete_verify_new_email, find_user_by_phone, find_user_by_name, find_user_by_mail, create_new_valid_user, save_profile_to_system_middle_ware, save_profile_to_system } = require('./backend/users/create.user.js');
const { log_in_user, log_out_user, fetch_user_details } = require("./backend/users/log.user.js");
const { create_new_valid_product, save_image_to_system, save_image_to_system_middle_ware } = require("./backend/products/create.product.js");
const { get_products_for_display, get_product_for_display } = require("./backend/products/display.product.js");
const { create_activity_new_user, add_cart_activity, remove_cart_activity, check_if_in_cart } = require("./backend/activities/create.activity.js");
const { get_all_in_cart } = require("./backend/activities/retrieve.activity.js")
const { create_new_category, delete_old_category, update_old_category, find_all_category } = require("./backend/products/product.category.js")
const { update_cart_item_count, clear_cart } = require("./backend/activities/update.count.js");
const { create_new_order, cancel_old_order } = require("./backend/orders/create.order.js");
const { check_if_in_orders, collect_if_in_orders } = require("./backend/orders/fetch.order.js");
const { confirm_order_email_send, verify_order_token } = require("./backend/orders/email.orders.js");

/* all middlewares and main path */
app.use(cors({
  origin: [
    'https://eliud-backend-server.onrender.com',
    'https://localhost:1000',
    'http://127.0.0.1:5500',
    'https://electronics.3liud.org',
    'https://3liud.org'
  ],
  credentials: true
}));
app.use((err, req, res, next) => {
  console.error("gen err =>"+err);
  res.status(500).json({ error: err.message, stack: err.stack });
});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.disable('x-powered-by');
//app.use("/alien/details/",express.static(process.cwd()+"/backend/images/"));
app.use("/api/email/verify_order/", express.static(process.cwd() + "/views/"))

/* all user paths */
app.get("/user/checkphone/:phone", find_user_by_phone);
app.get("/user/checkname/:username", find_user_by_name);
app.get("/user/checkemail/:myemail", find_user_by_mail);
app.get("/user/verify/email/:email/:user", verify_new_email);
app.get("/user/verify/complete/:user/:email/:token", complete_verify_new_email);
app.post("/alien/home", log_in_user);
app.get("/user/logout/:user", log_out_user);
app.get("/alien/details/:user", fetch_user_details);
app.post("/api/profile_image/save", save_profile_to_system_middle_ware, save_profile_to_system);
app.post("/acc/:uname/:fname/:lname/:email/:number/:pass1/:profile", create_new_valid_user);

/* all product paths */
app.get("/api/category/find/all", find_all_category);
app.post("/api/category/add/:category", create_new_category);
app.get("/api/category/delete/:category", delete_old_category);
app.get("/api/category/update/:old_category/:new_category", update_old_category);
app.post("/api/product/new", create_new_valid_product);
app.post("/api/image/save", save_image_to_system_middle_ware, save_image_to_system);
app.get("/api/product/getproducts", get_products_for_display);
app.get("/api/product/getproduct/:product_name", get_product_for_display);

/* all activity paths */
app.post("/api/activity/newuser/:username", create_activity_new_user);
app.post("/api/activity/cart/add/:active_user/:item/:count", add_cart_activity);
app.post("/api/activity/cart/remove/:active_user/:item", remove_cart_activity);
app.get("/api/activity/cart/check/:active_user/:item", check_if_in_cart);
app.get("/api/activity/cart/getall/:active_user", get_all_in_cart);
app.get("/api/cart/count/:user/:product/:action", update_cart_item_count);
app.get("/api/cart/clear/:user", clear_cart);

/* all order paths */
app.get("/api/order/create/:username/:date/:quantity/:total/:discount/:net/:tax/:cost/:location/:contacts", create_new_order);
app.get("/api/order/create/:username/:order_id", cancel_old_order);
app.get("/api/order/check/:username", check_if_in_orders);
app.get("/api/order/get/:username/:order_id", collect_if_in_orders);

/* all mail paths */
app.get("/api/email/create_order", confirm_order_email_send);
app.get("/api/email/verify_order", verify_order_token);

app.get("/health/:source", (req, res) => {
  res.json({ cool: "pinged:=> succefull" });
  console.log("ping => " + req.params.source);
});

let number = 0;
let time;
let ip = [];
app.set('trust proxy', true);
app.get('/client', (req, res) => {
  //console.log("time: ",time)
  clearTimeout(time);
  number++
  const new_ip = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
  if(!ip.includes(new_ip)){
    number = 1;
    ip.push(new_ip);
  }
  const timestamp = new Date();
  if (number == 1) {
    console.log(`atart IP: ${ip} + t ${timestamp}`);
  } else {
    time = setTimeout(() => {
      console.log(`end IP: ${ip} t ${timestamp}`);
      ip = []
    }, 600000);
  }
  res.status(200).json({});
});

//ssl/tsl certifictes for https local validation
const options = {
  key: fs.readFileSync(process.cwd() + '/localhost+3-key.pem'),    // your private key
  cert: fs.readFileSync(process.cwd() + '/localhost+3.pem')   // your certificate
};

// starting ap with https connection
https.createServer(options, app).listen(1000, () => {
  console.log('HTTPS server running on https://localhost:1000');
});

// app.listen(process.env.PORT || 3000, () => {
//   console.log(`Server is running on port ${process.env.PORT || 3000}`);
// });