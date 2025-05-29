require("dotenv").config()
const HOST_URL = process.env.LIVE_BACKEND_URL;
const IMAGE_URL = process.env.COUDINARY_IMAGE_URL;

const bcrypt = require("bcrypt");
const User = require("../connection.js").userColl
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const { Resend } = require("resend");
const jwt = require("jsonwebtoken")
const resend = new Resend(process.env.RESEND_API_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const baseName = file.originalname.split('.')[0];
    return {
      folder: "users", // folder in your Cloudinary account
      public_id: baseName,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      resource_type: "image",
      allowed_formats: ["jpg", "png", "jpeg"],
    }
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
const create_new_valid_user = async (req, res) => {
  const { uname, fname, lname, email, number, pass1, profile } = req.params
  const hashedPassword = await bcrypt.hash(pass1, 10);
  const my_profile = profile.split("~~~")[0];
  const my_version = profile.split("~~~")[1];
  const formated = "f_auto,q_auto,w_150,h_150,c_fill"
  const profile_pic_url = `${IMAGE_URL}/image/upload/${formated}/${my_version}/users/${my_profile}`
  console.log(req.params);
  const user = new User({
    username: uname,
    auth: false,
    first_name: fname,
    last_name: lname,
    email: email,
    number: number,
    password: hashedPassword,
    profile: profile_pic_url,
  })
  user.save();
  console.log(uname + " created account succefully")
  res.status(201).json({ message: `welcome ${uname}, your account was created succefully. please head to your email's inbox and verify your email to continue.` });
}

const verify_new_email = async (req, res) => {
  const { email, user } = req.params;
  const token = jwt.sign({ user, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  console.log(`token generated => [${token}]\nfor email => [${email}]\nby user => [${user}]`);
  await resend.emails.send({
    from: 'electronics-ke <electronics.hello@3liud.org>',
    to: email,
    subject: `Email verification for ${user}`,
    html: `
      <div style="text-align: center;">
       <h2>Hello ${user}, welcome to our platform. please verify your account by clickking the button below<h2>
       <a href="${HOST_URL}/user/verify/complete/${user}/${email}/${token}"><button>verify my email</button></a>
       <h3>this link is only valid for 1 hour exactly after the account was created and cannot be reused.</h3>
       <h4>thanks for joinining our platform and we are dedicated to offering you the best and legit products</h4>
       <h2>if you did not initiate the creation of a new accout it means someone tried to use it and you can ignore this email</h2>
       <br>
       <p>yours trully, electronics-ke</p>
      </div>
     `
  })
    .then(result => {
      if (result.error) {
        if(result.error.name == "application_error"){
          res.status(401).json({ success: false, data: result })
          console.log(`error level 1/=>${JSON.stringify(result)}\n result of email (${email}) verify for/=>${user}\n`)
        }else{
          res.status(402).json({ success: false, data: result })
          console.log(`error level 1/=>${JSON.stringify(result)}\n result of email (${email}) verify for/=>${user}\n`)
        }
      } else {
        res.status(201).json({ success: true, data: result })
        console.log(`success/=>${JSON.stringify(result)}\n result of email (${email}) verify for/=>${user}\n`)
      }
    })
    .catch(err => {
      console.log(`error level 0/=>${err}\n result of email (${email}) verify for/=>${user}\n`)
      res.status(422).json({ success: false, error: err })
    })
}

const complete_verify_new_email = async (req, res) => {
  const { user, email, token } = req.params;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    await User.findOneAndUpdate({ username: user, email }, { auth: true }, { new: true })
      .then(ans => {
        console.log("payload: " + JSON.stringify(payload));
        res.sendFile(process.cwd() + "/views/verified.user.html")
      })
      .catch(err => {
        console.error('server error: ' + err);
        res.sendFile(process.cwd() + "/views/error.user.html");
      })
  } catch (err){
    console.error('Invalid or expired token: ' + err);
    res.sendFile(process.cwd() + "/views/error.user.html");
  }
}

module.exports = {
  verify_new_email, complete_verify_new_email, find_user_by_phone, find_user_by_name, find_user_by_mail,
  create_new_valid_user, save_profile_to_system_middle_ware, save_profile_to_system
} 