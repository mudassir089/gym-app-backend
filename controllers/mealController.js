const Meal = require('../models/mealModel')
const User = require('../models/userModel')
const catchAsync = require('../util/catchAsync')
const AppError = require('../util/appError')

exports.createMeal = catchAsync(async (req, res, next) => {
    let {
        dayname,
        mealname,
        mealtype,
        ingredients,
        instructions,
        photo,
        protein,
        fats,
        carbs,
        calories,
        time,
        users
    } = req.body



    

    if(!dayname || !mealname || !mealtype || !ingredients || !instructions || !photo || !protein || !fats || !carbs || !calories || !time || !users) {
        return next(new AppError('Please provide all the required fields', 400))
    }

    ingredients = JSON.parse(ingredients)
    instructions = JSON.parse(instructions)
    users = JSON.parse(users)

    const meal = await Meal.create({
        dayname,
        mealname,
        mealtype,
        ingredients,
        instructions,
        photo,
        protein,
        fats,
        carbs,
        calories,
        time,
        users
    })

    res.status(200).json({
        status: 'success',
        data: meal
    })

})

exports.getMeal = catchAsync(async (req, res, next) => {
   const {id,day} = req.params

    if(!id || !day) {
        return next(new AppError('Please provide all the required fields', 400))
    }

    const meal = await Meal.find({dayname: day,users:{$elemMatch:{$eq:id}}}).select('photo _id mealname mealtype')

    if(meal.length === 0){
        return res.status(200).json({
            status: 'success',
            data:[],
            message: 'No meals Found'
        })
    }

    res.status(200).json({
        status: 'success',
        data:meal
    })
})

exports.getMealDetails = catchAsync(async (req, res, next) => {
    const {id} = req.params

    if(!id) {
        return next(new AppError('Meal Id is required', 400))
    }

    const meal = await Meal.findById(id)

    if(!meal) {
        return next(new AppError('Meal Not Found', 404))
    }

    res.status(200).json({
        status: 'success',
        data:meal
    })
})


