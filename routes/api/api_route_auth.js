const router = require('express').Router()
const {Kernel} = require('../../app/Http/Controllers/Kernel/Kernel')
const {body, check} = require('express-validator')
const {exists, unique} = require('../../app/Validations/exists')

router.post('/v1/user/register', [
    body('first_name', 'First name field is required').exists({checkFalsy : true}),
    body('last_name', 'Last name field is required').exists({checkFalsy : true}),
    body('email', 'Provide valid email address').normalizeEmail().isEmail()
        .if(body('email').isEmail())
        .custom(async (v, {req}) => {
            const res = await unique('email', 'User', 'email').run(req)
            return res.isEmpty()
        }),
    body('password').isLength({min:6}).withMessage('Password must contain at least 6 characters'),
], Kernel.map('ApiUserResourceController@register'))

router.post('/v1/user/authenticate', [
    body('email', 'Provide valid email address').normalizeEmail().isEmail()
        .if(body('email').isEmail())
        .custom(async (v, {req}) => {
           const res = await exists('email', 'User', 'email').run(req)
           return res.isEmpty()
        }),
    body('password', 'Password must contain at least 6 characters').isLength({min:6})
], Kernel.map('ApiUserResourceController@authenticate'))

router.post('/v1/token', Kernel.map('ApiUserResourceController@validateToken'))


/*
* Verify email
* */
router.get('/v1/email/confirm', [
    check('email', 'Provide valid email address').normalizeEmail().isEmail()
        .if(check('email').isEmail())
        .custom(async (v, {req}) => {
            const res = await exists('email', 'User', 'email').run(req)
            return res.isEmpty()
        }),
    check('code', 'Code must have 4 numbers').exists().bail()
    .isLength({min:4}).bail().isNumeric()
], Kernel.map('ApiUserResourceController@veryEmail'))

/*
* reset password route
* */
router.post('/v1/reset/password', [
    body('email', 'Provide valid email address').normalizeEmail().isEmail()
        .if(body('email').normalizeEmail().isEmail())
        .custom(async (v, {req}) => {
            const res = await exists('email', 'User', 'email').run(req)
            return res.isEmpty()
        }),
], Kernel.map('ApiResetPasswordController@reset'))

router.post('/v1/password/reset', [
    exists('token', 'User', 'token'),
    body('password', 'Password must have at least 6 characters').isLength({min : 6})
], Kernel.map('ApiResetPasswordController@resetPassword'))


module.exports = router