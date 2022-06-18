const catchAsync = require('../util/catchAsync')
const AppError = require('../util/appError')
const multer = require('../util/multer')
const cloudinary = require('../util/cloudinary')
const Video = require('../models/videoModel')
const fs = require('fs')

exports.uploadvideomiddleware = multer.multervideouploadmiddleware.single('video')


exports.createVideo = catchAsync(async (req, res, next) => {
    
    const {title} = req.body

    console.log(req.file.size,'title',title);

    try {
        const data = await cloudinary.uploader.upload(req.file.path,{resource_type: "video",})

        const video = await Video.create({
            title,
            video: data.secure_url,
        })

        fs.unlinkSync(req.file.path)

        res.status(200).json({
            status: "success",
            data: video,
        })
        
    } catch (error) {
        next(new AppError(error.message, 400))
    }
})