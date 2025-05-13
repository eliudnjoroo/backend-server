const User = require("../connection.js").userColl

//loging in user
const log_in_user = (req, res)=>{
  const { uNameL, uPassL } = req.params
  User.find({ username : `${uNameL}`, password: `${uPassL}`})
  .then(response=>{
    if(response.length > 0){res.json({ credentials: "correct" });}
    else{res.json({ credentials: "wrong" });}
  })
  console.log("\n loged in: \napi called and method "+req.method+" "+" "+req.protocol+"://"+req.host+req.url)
  console.log("got me from(origin) "+req.headers.origin)
}

//logging out user
const log_out_user =async (req, res)=>{
  const mydate= new Date();
  const user = req.params.user
  await User.findOneAndUpdate({ username: `${user}` }, { last_logout: mydate, logged: false }, {new: true })
  .then( ans=>{
    console.log("\n logged out: \napi called and method "+req.method+" "+" "+req.protocol+"://"+req.host+req.url)
    console.log("got me from(origin) "+req.headers.origin)
    res.json({ updated: "true" })}
  )
  .catch(err=>{console.log("error seting logged to false: "+err); res.json({ updated: "false" })})
}

//for fetching user details
const fetch_user_details = (req, res)=>{
    const { user } = req.params
    User.find({ username : `${user}`})
    .then(async response=>{
      if(response.length > 0){
        const date= new Date();
        await User.findOneAndUpdate({ username: `${user}` }, { last_login: date, logged: true }, { new: true })
        .then((dat)=>{
            console.log("\n refreshed: \napi called and method "+req.method+" "+" "+req.protocol+"://"+req.host+req.url)
            console.log("got me from(origin) "+req.headers.origin)
          }
        );
        res.json({ userdetails: response });
      }
      else{res.json({ userdetails: "not found" });}
    })
  }

module.exports = { log_in_user, log_out_user, fetch_user_details }