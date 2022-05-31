const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const catchAsync = require('../util/catchAsync')
const AppError = require('../util/appError')
const {promisify} = require('util')

const signtoken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });
  };

exports.AuthMiddleware = catchAsync(async function(req,res,next) {

    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        // eslint-disable-next-line prefer-destructuring
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        return next(
          new AppError('you are not logged in Please login to continue', 401)
        );
      }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  console.log(decoded);

  const CurrentUser = await User.findById(decoded.id)
  if(!CurrentUser){
    return next(
        new AppError('The token has been expired Please login again to continue', 401)
      );
  }

  req.user = CurrentUser

  next();
})

exports.LoginwithEmailandPassword =  catchAsync(async (req,res,next) => {
    const {email, password} = req.body

    if(!email || !password) {
       return next(new AppError('Both Email And Password are required to Login',400))
    }

    const FindedUser = await User.findOne({email:email})
 
    if(!FindedUser){
        return next(new AppError('Please Enter the correct email or password',400))
    }

    // const comparepassword = await bcrypt.compare(password,FindedUser.password)

    // if(!comparepassword){
    //     return next(new AppError('Please Enter the correct password',400))
    // }

    const token = signtoken(FindedUser._id)

    res.status(200).json({
        message:'Login SuccessFully',
        data:FindedUser,
        token
    })
   
})


exports.signup = catchAsync(async (req,res,next) => {
    const {firstname,lastname,email,password} = req.body

    if(!firstname || !email || !password || !lastname) {
        return next(new AppError('All fields are required to Signup',400))
    }


    const FindedUser = await User.findOne({email:email})

    if(FindedUser){
        return next(new AppError('User with this email already exists',400))
    }

    const newUser = await User.create({
        firstname,
        lastname,
        email,
        password,
    })

    // const token = signtoken(newUser._id)

    res.status(200).json({
        message:'User Created SuccessFully',
        data:newUser,
        // token
    })
})