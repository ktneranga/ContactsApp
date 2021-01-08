//inorder to connect to the datbase we need mongoose
const mongoose = require('mongoose');
// we need to bring in config => beacuse we need the access to the global variable file
const config = require('config');
//get the mongoUri from default.json
const db = config.get('mongoUri');

const connectDB = () => {
    mongoose.connect(db, {
        useNewUrlParser : true,
        useCreateIndex : true,
        useFindAndModify : false
    })
    .then(()=>console.log('MongoDB connected'))
    .catch(err=>{
        console.error(err.message);
        process.exit(1);
    })
}

module.exports = connectDB;