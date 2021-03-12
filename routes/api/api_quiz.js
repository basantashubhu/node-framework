const router = require('express').Router()
const {Kernel} = require("../../app/Http/Controllers/Kernel/Kernel")
const {body} = require('express-validator')

router.get('/v1/quiz', Kernel.map('ApiQuizController@getAll'))

router.get('/v1/quiz/random', [
    body('category_id', 'Category is required').exists({checkFalsy : true})
    .isMongoId(),
    body('difficulty', 'Difficulty level is required').exists({checkFalsy : true}),
], Kernel.map('ApiQuizController@random'))

router.get('/v1/quiz/:id', Kernel.map('ApiQuizController@findOne'))

router.post('/v1/quiz/insert', [
    body('title', 'Title is required').exists({checkFalsy : true}),
    body('start', 'Start date is required').exists({checkFalsy : true}),
    body('end', 'End date is required').exists({checkFalsy : true}),
    body('category', 'Category is required').exists({checkFalsy : true}),
    body('questions', 'Quiz requires at least 10 questions').exists({checkFalsy : true}).isArray({min : 10}),
], Kernel.map('ApiQuizController@insert'))

module.exports = router