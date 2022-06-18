const cors = require('cors');
const express = require('express');
const Globalerrorhandlingmiddleware = require('./controllers/errorController')
const morgan = require('morgan');
const userRouter = require('./router/userRoutes');
const AppError = require('./util/appError');
const mealRouter = require('./router/mealRoutes');
const videoRouter = require('./router/videoRoutes');
const exerciseRouter = require('./router/exerciseRoutes');
const recordRouter = require('./router/recordRoutes');


const app = express();

app.use(cors('*'))

app.use(morgan('dev'))


app.use(express.json({limit:"100mb"}))

app.use(express.urlencoded({
    extended:true
}))
 

app.use('/api/user',userRouter)
app.use('/api/meal',mealRouter)
app.use('/api/video',videoRouter)
app.use('/api/exercise',exerciseRouter)
app.use('/api/record',recordRouter)


app.all('*',(req,res,next) => {
  
    next(new AppError(`Could Not Find ${req.originalUrl} on the server`))

})



app.use(Globalerrorhandlingmiddleware)


module.exports = app