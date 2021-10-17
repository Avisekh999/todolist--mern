const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");


const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");
const { OAuth2Client } = require("google-auth-library");



const client = new OAuth2Client('656840063369-v9jes2g7h44nij9fd2aej0mgd8lvv0d5.apps.googleusercontent.com')
// @route    GET api/auth
// @desc     Test route
// @access   Private
router.get("/", auth, async (req, res) => {

  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user._id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);


router.post("/googlelogin", async (req, res) => {
  const {tokenId} = req.body;
  const payload = {
   
  };

  console.log(tokenId)
 await client.verifyIdToken({idToken:tokenId,audience:'656840063369-v9jes2g7h44nij9fd2aej0mgd8lvv0d5.apps.googleusercontent.com'})
  .then(response => {
     const {email_verified, name, email} = response.payload;
     console.log(response.payload);
     if(email_verified){
       User.findOne({email}).exec((err,user)=>{
         if(err){
           return res.status(400).json({
             error:'Something went wrong'
           })
         }else{
           if(user){
             const token =  jwt.sign(
              payload,
              process.env.JWT_SECRET,
              { expiresIn: 360000 })

              const {_id, name, email} = user;

              res.json({
                token,
                user:{_id, name,email}
              })

           }else{
             let password = email+ process.env.JWT_SECRET;
             let newUser = new User({name,email,password});
             res.json(newUser)
            //  newUser.save((err, data)=>{
            //    if(err){
            //      return res.status(400).json({
            //        error:'Something went wrong...'
            //      })
            //    }
            //    const token =  jwt.sign(
            //     payload,
            //     process.env.JWT_SECRET,
            //     { expiresIn: 360000 })
  
            //     const {_id, name, email} = newUser;
  
            //     res.json({
            //       token,
            //       user:{_id, name,email}
            //     })
            //  })
           }
         }
       })
     }
  })


})


module.exports = router;
