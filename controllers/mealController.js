const Meal = require("../models/mealModel");
const User = require("../models/userModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const sendmail = require("../util/sendemail");

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
    users,
  } = req.body;

  if (
    !dayname ||
    !mealname ||
    !mealtype ||
    !ingredients ||
    !instructions ||
    !photo ||
    !protein ||
    !fats ||
    !carbs ||
    !calories ||
    !time ||
    !users
  ) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  ingredients = JSON.parse(ingredients);
  instructions = JSON.parse(instructions);
  users = JSON.parse(users);

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
    users,
  });

  res.status(200).json({
    status: "success",
    data: meal,
  });
});

exports.getMeal = catchAsync(async (req, res, next) => {
  const { id, day } = req.params;

  if (!id || !day) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  const meal = await Meal.find({
    dayname: day,
    users: { $elemMatch: { $eq: id } },
  }).select("photo _id mealname mealtype");

  //   const allprops = await Meal.aggregate([
  //     {
  //       $project: {
  //         totalAmount: { $sum: "$protein" },
  //       },
  //     },
  //   ]);

  const nutrients = await Meal.aggregate([
    { $match: { dayname: day } },
    {
      $group: {
        _id: "nuts",
        proteins: { $sum: "$protein" },
        carbs: { $sum: "$carbs" },
        fats: { $sum: "$fats" },
        calories: { $sum: "$calories" },
      },
    },
  ]);

  if (meal.length === 0) {
    return res.status(200).json({
      status: "success",
      data: [],
      message: "No meals Found",
    });
  }

  res.status(200).json({
    status: "success",
    data: meal,
    nutrients: nutrients[0],
  });
});

exports.getMealDetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Meal Id is required", 400));
  }

  const meal = await Meal.findById(id);

  if (!meal) {
    return next(new AppError("Meal Not Found", 404));
  }

  res.status(200).json({
    status: "success",
    data: meal,
  });
});

exports.getMealIngridients = catchAsync(async (req, res, next) => {
  const { id, day } = req.params;

  if (!id) {
    return next(new AppError("Meal Id is required", 400));
  }

  // const ingredients = await Meal.find({
  //     dayname: day,
  //     users: { $elemMatch: { $eq: id } },
  //   }).select("ingredients")

  const ings = await Meal.aggregate([
    { $match: { dayname: day, users: { $elemMatch: { $eq: id } } } },
    { $unwind: "$ingredients" },
    {
      $group: {
        _id: {
          name: "$ingredients.name",
          image: "$ingredients.image",
          unit: "$ingredients.unit",
        },
        count: { $sum: 1 },
        totalValue: { $sum: "$ingredients.value" },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: ings,
  });
});

exports.Sendmealingridientstoemail = catchAsync(async (req, res, next) => {
  let { ings, email } = req.body;

  if (!ings) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  ings = JSON.parse(ings);

  console.log(ings);

  let html = `<div>
    
    <h1>List of Ingridients</h1>
    <ul>
    ${ings?.map(
      (ing) => `<li>${ing.name} - ${ing.totalValue} ${ing.unit}</li>`
    )}
    </ul>
    <h2>Here is your list of ingredients</h2>
    <h3>Thanks</h3>
    </div>`;

  sendmail("string", html, res);

  res.status(200).json({
    status: "success",
    data: ings,
  });
});

exports.getAllIngridientslist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let { days, persons } = req.body;
  days = JSON.parse(days);

  let ingredients = [];

  const findings = async (day) => {
    ingredients.push(
      await Meal.aggregate([
        { $match: { dayname: day, users: { $elemMatch: { $eq: id } } } },
        // { $match: { users: { $elemMatch: { $eq: id } } },dayname:day },
        { $unwind: "$ingredients" },
        {
          $group: {
            _id: {
              name: "$ingredients.name",
              image: "$ingredients.image",
              unit: "$ingredients.unit",
            },
            count: { $sum: 1 },
            totalValue: {
              $sum: { $multiply: ["$ingredients.value", persons ? persons : 1] },
            },
          },
        },
      ])
    );
  };

  try {
    await Promise.all(days.map((day) => findings(day)));
    res.status(200).json({
      status: "success",
      data: ingredients.flatMap((ing) => ing),
    });
  } catch (error) {
    console.log(error);
    next(new AppError(error.message, 400));
  }
});
