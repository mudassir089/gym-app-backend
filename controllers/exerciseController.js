const Exercise = require("../models/exerciseModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const cloudinary = require("../util/cloudinary");
const multer = require("../util/multer");
const { default: mongoose } = require("mongoose");
const fs = require("fs");

exports.exerciseimageuploadmiddleware =
  multer.imageuploadmiddleware.single("image");

exports.createExercise = catchAsync(async (req, res, next) => {
  let { name, days, weeks, superset, video, users, exercisetype, repetitions } =
    req.body;
  if (
    !name ||
    !days ||
    !weeks ||
    !video ||
    !users ||
    !exercisetype ||
    !repetitions
  ) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  days = JSON.parse(days);
  weeks = JSON.parse(weeks);
  users = JSON.parse(users);

  try {
    const photo = await cloudinary.uploader.upload(req.file.path);

    const exercise = await Exercise.create({
      name,
      days,
      weeks,
      superset: superset,
      video: mongoose.Types.ObjectId(video),
      users,
      exercisetype,
      repetitions,
      image: photo.secure_url,
    });

    fs.unlinkSync(req.file.path);

    res.status(200).json({
      status: "success",
      data: exercise,
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

exports.getExercises = catchAsync(async (req, res, next) => {
  const { day, week } = req.body;
  const { id } = req.params;

  console.log(day, week, id);

  if (!day || !week || !id) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  const exercises = await Exercise.find({
    users: { $elemMatch: { $eq: id } },
    days: { $elemMatch: { $eq: day } },
    weeks: { $elemMatch: { $eq: week } },
  })
    .select("-days -weeks -users")
    .sort({ superset: -1 });

  console.log(exercises);

  if (exercises.length === 0) {
    return res.status(200).json({
      status: "success",
      data: [],
    });
  }

  res.status(200).json({
    status: "success",
    data: exercises,
  });
});

exports.getAllExercises = catchAsync(async (req, res, next) => {
  const exercises = await Exercise.find({});
  res.status(200).json({
    status: "success",
    data: exercises,
  });
});

exports.getAllUserExercises = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  if (!id) {
    return next(new AppError("user Id is required", 400));
  }

  const exercises = await Exercise.find({ users: { $in: id } });
  if (exercises.length < 1) {
    return next(new AppError("Exercise Not Found", 404));
  }

  res.status(200).json({
    status: "success",
    data: exercises,
  });
});
