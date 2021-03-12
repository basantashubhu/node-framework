"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCategoryController = void 0;
const Controller_1 = require("../Kernel/Controller");
const Category_1 = require("../../../models/Category");
const File_1 = require("../../../models/File");
class ApiCategoryController extends Controller_1.Controller {
    constructor() {
        super();
        this.middleware('Auth');
    }
    /**
     * @route /api/v1/category
     * @method GET
     * get all categories from database
     * @param request
     * @param response
     */
    getAll(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield Category_1.Category.find({})
                .populate('user')
                .populate('image');
            response.json({ data: categories });
        });
    }
    /**
     * @route /api/v1/category
     * @method POST
     * insert category on database
     * @param request
     * @param response
     */
    insert(request, response) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.validate(request, response))
                return;
            if (!request.file)
                return response.status(422).json({ errors: { image: 'Please upload an image' } });
            let image = new File_1.File({
                file_name: request.file.originalname,
                path: request.file.path,
                mimetype: request.file.mimetype,
                size: request.file.size,
                user: (_a = request.auth) === null || _a === void 0 ? void 0 : _a.id()
            });
            yield image.save();
            const category = new Category_1.Category({
                category_name: request.body.category_name,
                image: image._id,
                parent: request.body.parent_id,
                user: (_b = request.auth) === null || _b === void 0 ? void 0 : _b.id()
            });
            category.save()
                .then(cat => response.json(cat))
                .catch(err => response.status(500).json({ message: err.message }));
        });
    }
    /**
     * @route /api/v1/category/:id
     * @method PUT
     * update category from database
     * @param request
     * @param response
     */
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.validate(request, response))
                return;
            const category = yield Category_1.Category.findById(request.params.id);
            if (!category)
                return response.status(404).json({ message: 'Category does not exists' });
            category.category_name = request.body.category_name;
            category.parent = request.body.parent_id;
            category.save()
                .then((cat) => response.json(cat))
                .catch((err) => response.status(500).json({ message: err.message }));
        });
    }
    /**
     * @route /api/v1/category/:id
     * @method DELETE
     * delete category from database
     * @param request
     * @param response
     */
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Category_1.Category.deleteOne({ _id: request.params.id });
            response.json({ status: 'success' });
        });
    }
}
exports.ApiCategoryController = ApiCategoryController;
