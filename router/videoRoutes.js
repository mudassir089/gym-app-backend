const express = require('express')
const VideoController = require('../controllers/videoController')

const videorouter = express.Router()

videorouter.post('/createVideo',VideoController.uploadvideomiddleware,VideoController.createVideo)


module.exports = videorouter