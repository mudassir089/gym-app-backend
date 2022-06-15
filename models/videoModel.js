const mongoose = require('mongoose')

const videoschema = new mongoose.Schema({
    title: { 
        type: String,
        required: true,
    },
    video: { type: String, required: true },

})


const Video = mongoose.model('Video', videoschema)

module.exports = Video