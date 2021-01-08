//auth is going to have login users
//checked the logged in users
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator/check');
const User = require('../models/User');
const auth = require('../middleware/auth');


//@route        GET api/auth
//desc          get logged in user
//access        private

router.get('/', auth ,async (req, res)=>{
    // res.send('get logged in user');
   try {
    const user = await User.findById(req.user.id).select('-password'); //we need data without the password
    res.json(user);
   } catch (err) {
       console.error(err.message);
       res.status(500).send('Server error');
   }
});

//@route        POST api/auth
//@desc         auth user and log in
//@access       public => submit user details -> authenticate-> get the token

router.post('/', [
    check('email', 'Please enter a valid email!').isEmail(),
    check('password', 'Password is required').exists()
],
async (req, res)=>{
   const errors = validationResult(req);

   if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()});
   }
   //if there are no errors get them from the body of the request
   const {email, password} = req.body;

   //if there are no errors with request we need to check that in the DB

   try {
       let user = await User.findOne({email : email});

       if(!user){
           return res.status(400).json({msg : 'Invalid Credentials'});
       }

       //if there is a user then check the password

       const isMatch = await bcrypt.compare(password, user.password);

       if(!isMatch){
           return res.status(400).json({msg : 'Invalid Credentials'});
       }

       //create the payload => to generate the token
       const payload = {
           user : {
               id : user.id
           }
       };
       //generate the token
       jwt.sign(payload, config.get('jwtSecret'), {expiresIn : 360000}, (err, token)=>{
            {
                err ? res.json({err:err}) : res.json({token:token});
            }
       });


   } catch (err) {
    console.error(err.message);
    //500 => server error
    res.status(500).send('Server error');
   }

});

module.exports = router;