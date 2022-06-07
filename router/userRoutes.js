const express = require('express');
const AuthController = require('../controllers/authController')
const UserController = require('../controllers/userController')

const userRouter = express.Router();

// userRouter.post('/uploadImage',UserController.UserSignupWithEmailAndPassword)


// ,UserController.uploadMiddleware
// userRouter.post('/signup',UserController.UserSignupWithEmailAndPassword)
userRouter.post('/login',AuthController.LoginwithEmailandPassword)
userRouter.post('/signup',AuthController.signup)
userRouter.post('/updateMeasures/:id',UserController.updateUserMeasurables)
userRouter.post('/uploadimage/:id',UserController.uploadUserBodyImage)
userRouter.post('/deleteimages/:id',UserController.deleteImageOfUserBody)
userRouter.get('/updateMeasureRecords/:id/:measure',UserController.updateUserBodyMeasureRecord)

module.exports = userRouter