"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const QuizSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    is_live: { type: Boolean, default: false },
    category: { type: mongoose_1.default.Types.ObjectId, ref: 'Category' },
    questions: [
        { type: mongoose_1.default.Types.ObjectId, ref: 'Question' }
    ],
    user: { type: mongoose_1.default.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});
exports.Quiz = mongoose_1.default.model('Quiz', QuizSchema);
