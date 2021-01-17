//users are going to have registering users
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const config = require('config'); //we need to access global variables
const { check, validationResult } = require('express-validator/check');

//importing userSchema into users route
const User = require('../models/User');

//get -> get data from the server
//post -> submit data into the server
//put -> update data 
//delete -> delete data of the server

//@route        POST api/users
//@desc         Register a user
//@access       public -> it just registering a new member to the system (before generating the token)

router.post('/', [
    check('name', 'Please add name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min : 6})
], async (req, res)=>{
   // now we need to send the req through the validationResult
   const errors = validationResult(req);
   console.log(errors.array());


   if(!errors.isEmpty()){
      return res.status(400).json({errors : errors.array()});
   }

   //if there are no errors get them from the request body
   const {name, email, password} = req.body;

   try {

      let user = await User.findOne({email : email});

      //check whether the user exist or not
      if(user){
         return res.status(400).json({msg : 'User already exists'});
      }

      //if the user doesn't exist create a new user

      user = new User({
         name : name,
         email : email,
         password : password
      }); // create a new instance of the user , we have to encrypt password befor save it to the DB
      
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      //save to the data base
      await user.save();

      //res.send('User saved');
      //create payload
      const payload = {
         user : {
            id : user.id //take the id of newly registered user
         }
      }

      jwt.sign(payload, config.get('jwtSecret'), { expiresIn : '360000' } , (err, token)=>{
         {
            err ? res.json({err:err}) : res.json({token:token});
         }
      })

   } catch (err) {
      console.error(err.message);
      //500 => server error
      res.status(500).send('Server error');
   }

});

module.exports = router;
//we need to limit what we send and make sure that certain things are sent