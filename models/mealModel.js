const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    dayname: {
      type: String,
      required: true,
    },
    mealname: {
      type: String,
      required: true,
    },
    mealtype: {
      type: String,
      required: true,
    },
    ingredients: {
      type: Array,
      required: true,
      default: [],
    },
    instructions: {
      type: Array,
      required: true,
      default: [],
    },
    photo: {
      type: String,
      required: true,
    },
    protein: {
      type: Number,
      required: true,
      default: 0,
    },
    fats: {
      type: Number,
      required: true,
      default: 0,
    },
    carbs: {
      type: Number,
      required: true,
      default: 0,
    },
    calories: {
      type: Number,
      required: true,
      default: 0,
    },
    time: {
      type: String,
      required: true,
      default: "",
    },
    users: {
        type:Array,
        required:true,
        select:false,

    },
    userremoved: {
      type: Boolean,
      default: false,
      select:false,

    },
  },
  { timestamps: true }
);

const Meal = mongoose.model("Meal", mealSchema);

mealSchema.pre(/^find/, async (next) => {
  await this.find({ userremoved: { $ne: false } });
  next();
});

module.exports = Meal;
