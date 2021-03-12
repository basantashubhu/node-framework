"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const filter = function (request, file, cb) {
    if (file.mimetype.indexOf('image/') !== -1) {
        cb(null, false);
    }
    else {
        cb(null, true);
    }
};
const storage = multer_1.default.diskStorage({
    destination(request, file, cb) {
        cb(null, './files');
    },
    filename(request, file, callback) {
        var _a, _b;
        let filename = new Date().getTime().toString();
        if ((_a = request.auth) === null || _a === void 0 ? void 0 : _a.user('first_name')) {
            filename += '_' + ((_b = request.auth) === null || _b === void 0 ? void 0 : _b.user('first_name'));
        }
        filename += '_' + file.originalname.replace(' ', '_');
        callback(null, filename);
    }
});
const upload = multer_1.default({ storage });
module.exports = upload;
