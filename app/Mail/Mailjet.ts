import mailjet from 'node-mailjet'

class Mailjet {
    private mailjet
    private _subject = ""

    constructor() {
        this.mailjet = mailjet.connect('57281faeb8da33de0fef14df9765b77d', '20da7cbe1c3c8e090fd82802f3c367c2')
            .post("send", { 'version': 'v3.1' })
    }

    subject(subject: string) {
        this._subject = subject
    }

    send(to: { Name: string, Email: string }, html: string) {
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
            })
    }
}

export default new Mailjet