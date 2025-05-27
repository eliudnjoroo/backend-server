const User = require("../connection.js").userColl

//loging in user
const log_in_user = (req, res) => {
  const { uNameL, uPassL } = req.params
  console.log(`${uNameL} tried using ${uPassL} to login.`);
  User.find({ username: `${uNameL}`, password: `${uPassL}` })
    .select("-password")
    .then(response => {
      if (response.length > 0) {
        if (!response[0].auth) {
          res.status(401).json({ credentials: "correct", message: "account not verified", email:response[0].email });
          console.log(uNameL + " was not logged in due to auth issue");
        } else {
          res.status(200).json({ credentials: "correct" });
          console.log(uNameL + " was logged in");
        }
      }
      else {
        res.json({ credentials: "wrong" });
        console.log(uNameL + " was not allowes to logged in")
      }
    })
}

//logging out user
const log_out_user = async (req, res) => {
  const mydate = new Date();
  const user = req.params.user
  await User.findOneAndUpdate({ username: `${user}` }, { last_logout: mydate, logged: false }, { new: true })
    .then(ans => {
      console.log(user + " logged out at " + mydate)
      res.json({ updated: "true" })
    }
    )
    .catch(err => { console.log("error seting logged to false: " + err); res.json({ updated: "false" }) })
}

//for fetching user details
const fetch_user_details = (req, res) => {
  const { user } = req.params
  User.find({ username: `${user}` })
    .then(async response => {
      if (response.length > 0) {
        const date = new Date();
        await User.findOneAndUpdate({ username: `${user}` }, { last_login: date, logged: true }, { new: true })
          .then((dat) => {
            console.log(user + " fetched his profile details")
          }
          );
        res.json({ userdetails: response });
      }
      else { res.json({ userdetails: "not found" }); }
    })
}

module.exports = { log_in_user, log_out_user, fetch_user_details }