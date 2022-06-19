const express = require("express");
const ExerciseController = require("../controllers/exerciseController");

const exerciseRouter = express.Router();

exerciseRouter.post(
  "/createExercise",
  ExerciseController.exerciseimageuploadmiddleware,
  ExerciseController.createExercise
);
exerciseRouter.get("/getAllExercise", ExerciseController.getAllExercises);

exerciseRouter.get(
  "/getAllUserExercises/:id",
  ExerciseController.getAllUserExercises
);

exerciseRouter.post("/getExercises/:id", ExerciseController.getExercises);

module.exports = exerciseRouter;
