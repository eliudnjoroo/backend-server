const User = require("../connection.js").userColl

/* functions involed in new account creation */
// functions for new user validation during creating a new user
const find_user_by_phone = async (req,res)=>{
    await User.find({ number: req.params.phone })
  .then((data)=>{
    if(data.length > 0 )
    return res.json({ user: "present" })
    res.json({ user: "absent" })
  })
}
const find_user_by_name = async (req,res)=>{
    await User.find({ username: req.params.username })
  .then((data)=>{
    if(data.length > 0 )
    return res.json({ user: "present" })
    res.json({ user: "absent" })
  })
}
const find_user_by_mail = async (req,res)=>{
    await User.find({ email: req.params.myemail })
  .then((data)=>{
    if(data.length > 0 )
    return res.json({ user: "present" })
    res.json({ user: "absent" })
  })
}
// function for creating the validatet new user
const create_new_valid_user = (req,res)=>{
    const { uname, fname, lname, email, number, pass1 } = req.params
    const user = new User({
      username: uname,
      first_name: fname,
      last_name: lname,
      email: email,
      number: number,
      password: pass1,
      profile: "https://localhost:1000/alien/details/defaults/defaultprofile.webp"
    })
    user.save();
    res.status(201).json({ message: `welcome ${uname}, your account was created succefully. you can now login.` });
}

module.exports = { 
    find_user_by_phone, find_user_by_name, find_user_by_mail, 
    create_new_valid_user 
} 