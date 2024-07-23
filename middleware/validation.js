const {body} = require('express-validator')

const RegistrationValidation=[
    body('name').not().isEmpty().withMessage('*Please enter name')
    .isString()
    .not().matches(/[0-9]/)
    .withMessage("*Name should be string"),
    body('mail').not().isEmpty().withMessage('*Please enter email')
    .isEmail().withMessage('*Invalid email format'),
    body('password').not().isEmpty().withMessage('*Please enter password')
    .isLength({min:6}).withMessage('*Password length should be minimum 6'),
    body('confirm_password').not().isEmpty().withMessage('*Please enter confirm password')
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('*Password & confirm password does not match');
        }
        return true;
    })
]
const LoginValidation=[
    body('mail').not().isEmpty().withMessage('*Please enter email'),
    body('password').not().isEmpty().withMessage('*Please enter password'),
]
module.exports = {RegistrationValidation,LoginValidation}


