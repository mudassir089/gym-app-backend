const sgMail = require('@sendgrid/mail')
const catchAsync = require('../util/catchAsync')
const AppError = require('../util/appError')

sgMail.setApiKey(process.env.sendgrid_api_key)

const emailobject = (email,html) =>  {

    return {
    to: 'rayyaan1120@gmail.com',
    from: 'brunoarcofitnessapp@gmail.com',
    subject: 'List of Ingridients',
    html: html
    }
}

const sendmail = async (email,html,res) => {

    try {
        await sgMail.send(emailobject(email,html))    
    } catch (error) {
        console.log(error);
        re.status(404).json({
            status: "fail",
            message: "Failed To sent the email",
        })
    }
    

}

module.exports = sendmail