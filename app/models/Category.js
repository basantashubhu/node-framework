"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CategorySchema = new mongoose_1.default.Schema({
    category_name: {
        type: String,
        required: true,
        unique: true
    },
    image: { type: mongoose_1.default.Types.ObjectId, ref: 'File' },
    is_active: {
        type: Boolean,
        default: true
    },
    parent: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category'
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});
exports.Category = mongoose_1.default.model('Category', CategorySchema);
