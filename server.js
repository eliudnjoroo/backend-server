const express= require('express');
const cors = require('cors');
const app=express();
const https = require('https');  // ① for creating the HTTPS server
const fs = require('fs');  
const { find_user_by_phone, find_user_by_name, find_user_by_mail, create_new_valid_user  } = require('./backend/users/create.user.js');
const { log_in_user, log_out_user, fetch_user_details } = require("./backend/users/log.user.js");
const { create_new_valid_product, save_image_to_system, save_image_to_system_middle_ware } = require("./backend/products/create.product.js");
const { get_products_for_display, get_product_for_display } = require("./backend/products/display.product.js");
const { create_activity_new_user, add_cart_activity, remove_cart_activity, check_if_in_cart } = require("./backend/activities/create.activity.js");
const { get_all_in_cart } = require("./backend/activities/retrieve.activity.js")
const { create_new_category, delete_old_category, update_old_category, find_all_category } = require("./backend/products/product.category.js")
const { update_cart_item_count, clear_cart } = require("./backend/activities/update.count.js")

/* all middlewares and main path */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/alien/details/",express.static(process.cwd()+"/backend/images/"));
app.use("/",express.static(process.cwd()+"/backend/images/products/"));

/* all user paths */
app.get("/user/checkphone/:phone",find_user_by_phone);
app.get("/user/checkname/:username", find_user_by_name );
app.get("/user/checkemail/:myemail", find_user_by_mail );
app.get("/alien/home/:uNameL/:uPassL", log_in_user);
app.get("/user/logout/:user", log_out_user );
app.get("/alien/details/:user", fetch_user_details );
app.post("/acc/:uname/:fname/:lname/:email/:number/:pass1", create_new_valid_user );

/* all product paths */
app.get("/api/category/find/all", find_all_category );
app.post("/api/category/add/:category", create_new_category );
app.get("/api/category/delete/:category", delete_old_category );
app.get("/api/category/update/:old_category/:new_category", update_old_category );
app.post("/api/product/new", create_new_valid_product );
app.post("/api/image/save", save_image_to_system_middle_ware, save_image_to_system);
app.get("/api/product/getproducts", get_products_for_display );
app.get("/api/product/getproduct/:product_name", get_product_for_display );

/* all activity paths */
app.post("/api/activity/newuser/:username", create_activity_new_user );
app.post("/api/activity/cart/add/:active_user/:item/:count", add_cart_activity );
app.post("/api/activity/cart/remove/:active_user/:item", remove_cart_activity );
app.get("/api/activity/cart/check/:active_user/:item", check_if_in_cart );
app.get("/api/activity/cart/getall/:active_user", get_all_in_cart );
app.get("/api/cart/count/:user/:product/:action", update_cart_item_count );
app.get("/api/cart/clear/:user", clear_cart );

app.get("/health/:source", (req, res) => {
  res.json({ cool: "pinged:=> succefull" });
  console.log("pinged:=> succefull, source: " + req.params.source);
});

app.get('/client', (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
  console.log('Client IP:', ip);
  res.json({ message: `your_IP_is: => ${ip}`});
});

//ssl/tsl certifictes for https local validation
const options = {
  key: fs.readFileSync(process.cwd()+'/localhost+3-key.pem'),    // your private key
  cert: fs.readFileSync(process.cwd()+'/localhost+3.pem')   // your certificate
};

// starting ap with https connection
https.createServer(options, app).listen(1000, () => {
  console.log('HTTPS server running on https://localhost:1000');
});

// app.listen(process.env.PORT || 3000, () => {
//   console.log(`Server is running on port ${process.env.PORT || 3000}`);
// });