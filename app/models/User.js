"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    gender: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    userType: {
        type: String,
        enum: ['admin', 'user'],
        required: true,
        default: 'user'
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: false
    },
    code: {
        type: Number,
        required: false
    },
    verifiedAt: {
        type: Date,
        required: false
    },
    profileImage: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'File',
    }
}, {
    timestamps: true,
});
exports.User = mongoose_1.default.model('User', UserSchema);
