"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const FileSchema = new mongoose_1.default.Schema({
    file_name: String,
    path: String,
    mimetype: String,
    size: Number,
    user: { type: mongoose_1.default.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});
exports.File = mongoose_1.default.model('File', FileSchema);
