const User = require("../connection.js").userColl
require("dotenv").config()
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "users",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
const upload = multer({ storage })
const save_profile_to_system_middle_ware = upload.single("profile");

const save_profile_to_system = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  res.json({
    success: true,
    message: "File uploaded",
    url: req.file.path,        // URL for frontend use
    public_id: req.file.filename // For future deletions if needed
  });
}

/* functions involed in new account creation */
// functions for new user validation during creating a new user
const find_user_by_phone = async (req, res) => {
  await User.find({ number: req.params.phone })
    .then((data) => {
      if (data.length > 0)
        return res.json({ user: "present" })
      res.json({ user: "absent" })
    })
}
const find_user_by_name = async (req, res) => {
  await User.find({ username: req.params.username })
    .then((data) => {
      if (data.length > 0)
        return res.json({ user: "present" })
      res.json({ user: "absent" })
    })
}
const find_user_by_mail = async (req, res) => {
  await User.find({ email: req.params.myemail })
    .then((data) => {
      if (data.length > 0)
        return res.json({ user: "present" })
      res.json({ user: "absent" })
    })
}
// function for creating the validatet new user
const create_new_valid_user = (req, res) => {
  const { uname, fname, lname, email, number, pass1, profile } = req.params
  const user = new User({
    username: uname,
    first_name: fname,
    last_name: lname,
    email: email,
    number: number,
    password: pass1,
    profile: profile
  })
  user.save();
  console.log(uname + " created account succefully")
  res.status(201).json({ message: `welcome ${uname}, your account was created succefully. you can now login.` });
}

module.exports = {
  find_user_by_phone, find_user_by_name, find_user_by_mail,
  create_new_valid_user, save_profile_to_system_middle_ware, save_profile_to_system
} 