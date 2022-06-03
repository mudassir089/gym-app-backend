const User = require('../models/userModel')
const catchAsync = require('../util/catchAsync')
const AppError = require('../util/appError')
const cloudinary = require('../util/cloudinary')


exports.updateUserMeasurables = catchAsync(async (req,res,next) => {
    const {id} = req.params
    
    if(!id) {
       return next(new AppError('User Id is required',400))
    }

    let updatekey;
    let updatevalue;

    Object.entries(req.body).forEach(([key,value]) => {
        updatekey = key
        updatevalue = value
    })

    

    const FindedUser = await User.findByIdAndUpdate(id,{[updatekey]:updatevalue},{new:true})
    if(!FindedUser) {
       return next(new AppError('User Not Found',404))
    }

    res.status(200).json({
        status: 'success',
        data:FindedUser
    })
})

exports.uploadUserBodyImage = catchAsync(async (req, res,next) => {

    let {images} = req.body
    images = JSON.parse(images)
    console.log(images,'immmmm');
    let imgsend = []
    let user;

    const uploadimage = async (img) => {


           const data = await cloudinary.uploader.upload(img.image)            
        // user = await User.findByIdAndUpdate(req.params.id,{$push:{photos:{display:img.display,image:data.secure_url}}},{new:true})
        user = await User.findOneAndUpdate(
            {_id:req.params.id,"photos.display":img.display},
            {$set:{"photos.$.image":data.secure_url}}
        )
        console.log(data.secure_url,'securee');
    }

    console.log(user,'user')

    try {
        await Promise.all(images.map((img) => uploadimage(img)))
        res.status(200).json({
            status: 'success',
            data:user
        })
    } catch (error) {
        next(new AppError(error.message,400))
    }

})

exports.deleteImageOfUserBody = catchAsync(async (req, res,next) => {
    const {id} = req.params
    if(!id) return next(new AppError('User Id is required',400))


})