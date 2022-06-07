const express = require('express');
const AuthController = require('../controllers/authController')
const MealController = require('../controllers/mealController')

const mealRouter = express.Router();

mealRouter.post('/createMeal',MealController.createMeal)
mealRouter.get('/getMeal/:id/:day',MealController.getMeal)
mealRouter.get('/getMealDetails/:id',MealController.getMealDetails)

module.exports = mealRouter
