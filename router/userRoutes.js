const express = require('express');
const AuthController = require('../controllers/authController')

const userRouter = express.Router();

// userRouter.post('/uploadImage',UserController.UserSignupWithEmailAndPassword)


// ,UserController.uploadMiddleware
// userRouter.post('/signup',UserController.UserSignupWithEmailAndPassword)
userRouter.post('/login',AuthController.LoginwithEmailandPassword)
userRouter.post('/signup',AuthController.signup)

module.exports = userRouter