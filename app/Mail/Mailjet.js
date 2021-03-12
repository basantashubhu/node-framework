"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mailjet_1 = __importDefault(require("node-mailjet"));
class Mailjet {
    constructor() {
        this._subject = "";
        this.mailjet = node_mailjet_1.default.connect('57281faeb8da33de0fef14df9765b77d', '20da7cbe1c3c8e090fd82802f3c367c2')
            .post("send", { 'version': 'v3.1' });
    }
    subject(subject) {
        this._subject = subject;
    }
    send(to, html) {
        return this.mailjet
            .request({
            "Messages": [
                {
                    "From": {
                        "Email": "livequiznepal@gmail.com",
                        "Name": "Live Quiz Team"
                    },
                    "To": [to],
                    "Subject": this._subject,
                    "CustomID": "AppGettingStartedTest",
                    "HTMLPart": html
                }
            ]
        });
    }
}
exports.default = new Mailjet;
