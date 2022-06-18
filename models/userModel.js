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
    },
    weight:{
        type:String,
    },
    bodyfat:{
        type:String,
    },
    arms:{
        type:String,
    },
    shoulder:{
        type:String,
    },
    chest:{
        type:String,
    },
    waist:{
        type:String,
    },
    hips:{
        type:String,
    },
    legs:{
        type:String,
    },
    twins:{
        type:String,
    },
    height:{
        type:String,
    },
    photos:{
        type:Array,
        default:[
            {
                display:"Frente",
                image:""
            },
            {
                display:"Lado",
                image:""
            },
            {
                display:"Espalda",
                image:""
            }
        ]
    },
    weightRecord:{
        type:Array,
        default:[]
    },
    bodyfatRecord:{
        type:Array,
        default:[]
    },
    armsRecord:{
        type:Array,
        default:[]
    },
    shoulderRecord:{
        type:Array,
        default:[]
    },
    chestRecord:{
        type:Array,
        default:[]
    },
    waistRecord:{
        type:Array,
        default:[]
    },
    hipsRecord:{
        type:Array,
        default:[]
    },
    legsRecord:{
        type:Array,
        default:[]
    },
    twinsRecord:{
        type:Array,
        default:[]
    },
    heightRecord:{
        type:Array,
        default:[]
    },
    image:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1c_Kup7Pd1rkP7yZAWY_sbmjEZlHyFFrrUQ&usqp=CAU"
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