//we can create models with mongoose
//inside the model we craete a schema
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true 
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    }
});

module.exports = mongoose.model('user', userSchema);