import {Controller} from "../Kernel/Controller";
import {Request, Response} from "express";
import {Quiz} from "../../../models/Quiz";

export class ApiQuizController extends Controller {
    constructor() {
        super();
        this.middleware('Auth')
            .only('AdminGuard', 'insert')
    }

    /**
     * @route /api/v1/quiz
     * @method GET
     * get all quizzes from database
     * @param request
     * @param response
     */
    async getAll(request : Request, response : Response) {
        const quizzes = await Quiz.find({})
        response.json(quizzes)
    }

    /**
     * @route /api/v1/quiz/:id
     * @method GET
     * find one quiz with the id
     * @param request
     * @param response
     */
    async findOne(request : Request, response : Response) {
        const quiz = await Quiz.findById(request.params.id)
            .populate('questions')
            .populate('user')
            .populate('category')

        response.json(quiz)
    }

    async insert(request : Request, response : Response) {

    }

    async random(request : Request, response : Response) {
        console.log(request.query);
        
        return response.json({data : ["find by id", "esewa unlock"]})
    }
}