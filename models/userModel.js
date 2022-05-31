const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true
    },
    lastname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        // unique:true
    },
    password:{
        type:String,
        required:true,
    }
},{
    toJSON:{
        transform:(doc,ret) => {
            let {password,__v,...rest} = ret;
            return rest;
        }
    }
})


const User = mongoose.model('User',userschema);
module.exports = User;