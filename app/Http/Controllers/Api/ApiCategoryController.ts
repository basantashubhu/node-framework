import {Controller} from "../Kernel/Controller";
import {Request, Response} from "express";
import {Category} from "../../../models/Category";
import {File} from "../../../models/File";

export class ApiCategoryController extends Controller {
    constructor() {
        super();
        this.middleware(
            'Auth',
            // 'AdminGuard'
        )
    }

    /**
     * @route /api/v1/category
     * @method GET
     * get all categories from database
     * @param request
     * @param response
     */
    async getAll(request : Request, response : Response) {
        const categories = await Category.find({})
            .populate('user')
            .populate('image')

        response.json({data : categories})
    }

    /**
     * @route /api/v1/category
     * @method POST
     * insert category on database
     * @param request
     * @param response
     */
    async insert(request : Request, response : Response) {
        if (!this.validate(request, response)) return
        if (!request.file) return response.status(422).json({errors : {image : 'Please upload an image'}})

        let image = new File({
            file_name : request.file.originalname,
            path : request.file.path,
            mimetype : request.file.mimetype,
            size : request.file.size,
            user : request.auth?.id()
        })
        await image.save()

        const category = new Category({
            category_name : request.body.category_name,
            image : image._id,
            parent : request.body.parent_id,
            user : request.auth?.id()
        })
        category.save()
            .then(cat => response.json(cat))
            .catch(err => response.status(500).json({message : err.message}))
    }

    /**
     * @route /api/v1/category/:id
     * @method PUT
     * update category from database
     * @param request
     * @param response
     */
    async update(request : Request, response : Response) {
        if (!this.validate(request, response)) return;
        const category = await Category.findById(request.params.id)
        if (!category) return response.status(404).json({message : 'Category does not exists'})
        category.category_name = request.body.category_name
        category.parent = request.body.parent_id
        category.save()
            .then((cat: any) => response.json(cat))
            .catch((err: any) => response.status(500).json({message : err.message}))
    }

    /**
     * @route /api/v1/category/:id
     * @method DELETE
     * delete category from database
     * @param request
     * @param response
     */
    async delete(request : Request, response : Response) {
        await Category.deleteOne({_id : request.params.id})
        response.json({status : 'success'})
    }
}