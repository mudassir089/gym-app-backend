const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors())

app.use(express.json({limit:"50mb"}))

app.use(express.urlencoded({
    extended:true
}))
 

module.exports = app