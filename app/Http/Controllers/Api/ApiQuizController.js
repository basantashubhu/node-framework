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
exports.ApiQuizController = void 0;
const Controller_1 = require("../Kernel/Controller");
const Quiz_1 = require("../../../models/Quiz");
class ApiQuizController extends Controller_1.Controller {
    constructor() {
        super();
        this.middleware('Auth')
            .only('AdminGuard', 'insert');
    }
    /**
     * @route /api/v1/quiz
     * @method GET
     * get all quizzes from database
     * @param request
     * @param response
     */
    getAll(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const quizzes = yield Quiz_1.Quiz.find({});
            response.json(quizzes);
        });
    }
    /**
     * @route /api/v1/quiz/:id
     * @method GET
     * find one quiz with the id
     * @param request
     * @param response
     */
    findOne(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const quiz = yield Quiz_1.Quiz.findById(request.params.id)
                .populate('questions')
                .populate('user')
                .populate('category');
            response.json(quiz);
        });
    }
    insert(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    random(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(request.query);
            return response.json({ data: ["find by id", "esewa unlock"] });
        });
    }
}
exports.ApiQuizController = ApiQuizController;
