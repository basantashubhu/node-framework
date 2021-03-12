const {exists} = require("../../app/Validations/exists");
const router = require('express').Router()
const {Kernel} = require('../../app/Http/Controllers/Kernel/Kernel')
const {body, check} = require('express-validator')

/*router.get('/login', Kernel.map('LoginController@loginPage'))
router.post('/login', Kernel.map('LoginController@login'))
router.post('/register', [
    body('first_name').exists({checkFalsy : true}).withMessage('First name field is required'),
    body('last_name').exists({checkFalsy : true}).withMessage('Last name field is required'),
    body('email').normalizeEmail().isEmail().withMessage('Email must be valid email address'),
    body('password').isLength({min:6}).withMessage('Password must have at least 6 charactors'),
    body('rpassword').custom((rp, {req}) => req.body ? rp === req.body.password : false)
    .withMessage('Password confirmation did not match password')
], Kernel.map('RegistrationController@register'))*/

/*
* reset password route
* */
// router.post('/reset/password', Kernel.map('ResetPassword@reset'))
// router.get('/reset/email/list', Kernel.map('ResetPassword@emailList'))
router.get('/password/reset', Kernel.map('ResetPassword@resetPasswordForm'))
router.post('/password/reset', [
    body('password', 'Password must have at least 6 characters').isLength({min:6})
], Kernel.map('ResetPassword@resetPassword'))

/*
* Verify email
* */
router.get('/email/confirm', [
    check('email', 'Email must be valid email address').normalizeEmail().isEmail()
        .if(check('email', 'Email must be valid email address').normalizeEmail().isEmail())
        .custom(async (v, {req}) => {
            const res = await exists('email', 'User', 'email').run(req)
            return res.isEmpty()
        })
], Kernel.map('RegistrationController@veryEmail'))

module.exports = router