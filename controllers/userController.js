const User = require("../models/userModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const cloudinary = require("../util/cloudinary");

exports.updateUserMeasurables = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("User Id is required", 400));
  }

  let updatekey;
  let updatevalue;

  Object.entries(req.body).forEach(([key, value]) => {
    updatekey = key;
    updatevalue = value;
  });

  const FindedUser = await User.findByIdAndUpdate(
    id,
    {
      [updatekey]: updatevalue,
      $push: {
        [`${updatekey}Record`]: { date: new Date(), value: updatevalue },
      },
    },
    { new: true }
  );
  if (!FindedUser) {
    return next(new AppError("User Not Found", 404));
  }

  res.status(200).json({
    status: "success",
    data: FindedUser,
  });
});

exports.uploadUserBodyImage = catchAsync(async (req, res, next) => {
  let { images } = req.body;
  images = JSON.parse(images);
  console.log(images, "immmmm");
  let imgsend = [];
  let user;

  const uploadimage = async (img) => {
    if (img.image === "" || img.image.length < 200) return;

    const data = await cloudinary.uploader.upload(img.image);
    // user = await User.findByIdAndUpdate(req.params.id,{$push:{photos:{display:img.display,image:data.secure_url}}},{new:true})
    user = await User.findOneAndUpdate(
      { _id: req.params.id, "photos.display": img.display },
      { $set: { "photos.$.image": data.secure_url } },
      { new: true }
    );
    console.log(data.secure_url, "securee");
  };

  console.log(user, "user");

  try {
    await Promise.allSettled(images.map((img) => uploadimage(img)));
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

exports.deleteImageOfUserBody = catchAsync(async (req, res, next) => {
  let { displays } = req.body;
  displays = JSON.parse(displays);

  const { id } = req.params;
  if (!id) return next(new AppError("User Id is required", 400));

  let user;

  const deleteimage = async (display) => {
    user = await User.findOneAndUpdate(
      { _id: req.params.id, "photos.display": display },
      { $set: { "photos.$.image": "" } },
      { new: true }
    );
  };

  try {
    await Promise.all(displays.map((display) => deleteimage(display)));
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

exports.updateUserBodyMeasureRecord = catchAsync(async (req, res, next) => {
  let { id, measure } = req.params;
  if (!id) return next(new AppError("User Id is required", 400));
  if (!measure) return next(new AppError("Measurement is required", 400));

  try {
    let FindedUser = await User.findById(id);
    if (!FindedUser) return next(new AppError("User Not Found", 404));

    let measurearr = FindedUser[`${measure}Record`];

    function subtractMonths(numOfMonths, date = new Date()) {
      date.setMonth(date.getMonth() - numOfMonths);

      return date;
    }

    let user;

    const updaterecord = async () => {
      user = await User.findByIdAndUpdate(
        id,
        {
          $pull: {
            [`${measure}Record`]: { date: { $lte: subtractMonths(1) } },
          },
        },
        { new: true }
      ).sort({ [`${measure}Record.date`]: -1 });
    };

    console.log(measurearr, "measurearr");

    try {
      if (measurearr.length > 0) {
        await Promise.all(measurearr.map((record) => updaterecord()));
        res.status(200).json({
          status: "success",
          data: user,
        });
      } else {
        res.status(200).json({
          status: "success",
          data: FindedUser,
        });
      }
    } catch (error) {
      next(new AppError(error.message, 400));
    }
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});
