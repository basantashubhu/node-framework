const router = require('express').Router()

router.get('/500', function (request, response) {
    response.status(500).render('errors/500')
})

router.get('/404', function (request, response) {
    response.status(404).render('errors/404')
})

router.get('*', function (request, response) {
    response.status(404).render('errors/404')
})

module.exports = router