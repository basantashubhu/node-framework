const router = require('express').Router()
const { body } = require('express-validator')
const {Kernel} = require('../../app/Http/Controllers/Kernel/Kernel')
const multer = require('../../app/Http/Middlewares/Multer')

router.post('/v1/users/all', Kernel.map('ApiUserController@userAll'))

router.patch('/v1/user/:id', [
], Kernel.map('ApiUserController@updateUser'))

router.get('/v1/my/profile', Kernel.map('ApiUserController@myProfile'))

router.put('/v1/user/updateProfile', multer.single('profile'), Kernel.map('ApiUserController@updateProfilePicture'))

module.exports = router