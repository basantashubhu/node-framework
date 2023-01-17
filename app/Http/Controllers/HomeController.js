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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeController = void 0;
const Controller_1 = require("./Kernel/Controller");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const File_1 = require("../../models/File");
class HomeController extends Controller_1.Controller {
    constructor() {
        super();
    }
    index(request, response) {
        response.render('index');
    }
    /**
     * @route /file/:id
     * file response
     * @param request
     * @param response
     */
    responseFile(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield File_1.File.findById(request.params.id);
            const filePath = path_1.default.join(process.cwd(), file.path);
            if (fs_1.default.existsSync(filePath)) {
                return response.sendFile(filePath);
            }
            response.status(404).json({ message: 'File not found' });
        });
    }
}
exports.HomeController = HomeController;
