const express = require('express');
const app = express();
const connectDB = require('./config/db');

//bcryptjs for hashing passwords
//jsonwebtokens => for authentication
//dependencies => npm i bcryptjs jsonwebtoken config express-validator or mongoose
//nodemon => npm i -D nodemon concurrently(allow to run backend and the frontend servers at same time)

//connect DB
connectDB();

//middleware bodyparser
app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.get('/', (req, res)=>res.json({msg:'Welcome to the contact api'}));

//define routes
app.use('/api/auth', require('./routes/auth')); //2nd
app.use('/api/users', require('./routes/users')); //1st
app.use('/api/contacts', require('./routes/contact')); //3rd

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server is running on port ${PORT}`));