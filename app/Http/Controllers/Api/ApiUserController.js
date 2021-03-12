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
exports.ApiUserController = void 0;
const User_1 = require("../../../models/User");
const Controller_1 = require("../Kernel/Controller");
const File_1 = require("../../../models/File");
class ApiUserController extends Controller_1.Controller {
    constructor() {
        super();
        this.middleware('Auth');
    }
    /**
     * @route /api/v1/users/all
     * Get all user from database
     * @param request
     * @param response
     */
    userAll(request, response) {
        User_1.User.find(function (err, users) {
            if (err) {
                return response.status(500).send({ message: err.message });
            }
            response.send(users);
        });
    }
    /**
     * @route /api/v1/user/:id [PATCH]
     * Api update user
     * @param request
     * @param response
     */
    updateUser(request, response) {
        User_1.User.findById(request.params.id, function (err, user) {
            if (err)
                return response.status(500).json({ message: err.message });
            if (!user)
                return response.status(404).json({ message: 'User does not exists' });
            const data = [
                ['email', request.body.email],
                ['first_name', request.body.first_name],
                ['last_name', request.body.last_name],
            ].map(x => {
                if (x[1]) {
                    user[x[0]] = x[1];
                }
            });
            user.save().then(() => response.json(user))
                .catch((err) => response.status(500).json({ message: err.message }));
        });
    }
    /**
     * @route /api/v1/my/profile
     * profile details of logged in user
     * @param request
     * @param response
     */
    myProfile(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findById((_a = request.auth) === null || _a === void 0 ? void 0 : _a.id())
                .populate('profileImage');
            response.json({ data: user });
        });
    }
    /**
     * @route /api/v1/user/updateProfilePicture
     * @method PATCH
     * api update profile picture of logged in user
     * @param request
     * @param response
     */
    updateProfilePicture(request, response) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.file)
                return response.status(422).json({ message: 'Please select a file' });
            const profileImage = new File_1.File({
                file_name: request.file.originalname,
                path: request.file.path,
                mimetype: request.file.mimetype,
                size: request.file.size,
                user: (_a = request.auth) === null || _a === void 0 ? void 0 : _a.id()
            });
            yield profileImage.save();
            User_1.User.findById((_b = request.auth) === null || _b === void 0 ? void 0 : _b.id(), function (err, user) {
                user.profileImage = profileImage._id;
                user.save().then(() => response.json({ message: 'Profile image successfully updated' }))
                    .catch((err) => response.status(500).json({ message: err.message }));
            });
        });
    }
}
exports.ApiUserController = ApiUserController;
