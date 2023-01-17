const router = require('express').Router()
const {Route} = require('../app/Http/Controllers/Kernel/Kernel')
Route.use(router);


Route.get('/', ['HomeController', 'index']);

Route.get('/file/:id', ['HomeController', 'responseFile'])

module.exports = router