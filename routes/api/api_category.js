const {unique} = require("../../app/Validations/exists");
const {exists} = require("../../app/Validations/exists");
const Router = require('express').Router()
const {Kernel} = require('../../app/Http/Controllers/Kernel/Kernel')
const {body} = require('express-validator')
const upload = require('../../app/Http/Middlewares/Multer');
const {AuthMiddleware} = require("../../app/Http/Middlewares/AuthMiddleware");

Router.get('/v1/category', Kernel.map('ApiCategoryController@getAll'))

Router.post('/v1/category', AuthMiddleware.getInstance().use(), upload.single('image'), [
    body('category_name', 'Category name is required').exists({checkFalsy : true})
        .if(body('category_name').exists())
        .custom(async (cat, {req}) => {
            const res = await unique('category_name', 'Category', 'category_name').run(req)
            return res.isEmpty()
        }),
    body('parent_id', 'Parent is not valid').if(body('parent_id').exists())
        .isMongoId().bail()
        .custom(async (parent_id, {req}) => {
            const res = await exists('parent_id', 'Category', '_id').run(req)
            return res.isEmpty()
        })
], Kernel.map('ApiCategoryController@insert'))

Router.put('/v1/category/:id', [
    body('category_name', 'Category name is required').exists({checkFalsy : true})
        .if(body('category_name').exists())
        .custom(async (cat, {req}) => {
            const res = await unique('category_name', 'Category', 'category_name', null, req.params.id).run(req)
            return res.isEmpty()
        }),
    body('parent_id', 'Parent is not valid').if(body('parent_id').exists())
        .isMongoId().bail()
        .custom(async (parent_id, {req}) => {
            const res = await exists('parent_id', 'Category', '_id').run(req)
            return res.isEmpty()
        })
], Kernel.map('ApiCategoryController@update'))

Router.delete('/v1/category/:id', Kernel.map('ApiCategoryController@delete'))

module.exports = Router