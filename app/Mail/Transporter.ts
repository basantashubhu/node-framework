import nodemailer, {TestAccount} from 'nodemailer'

class Transporter {
    host : string = "smtp.ethereal.email"
    port : number = 587
    secure : boolean = false
    auth : {
        user : string, pass : string
    } = {
        user : "bxvaat4b5ojdj4kc@ethereal.email",
        pass : "FMxPKqZ6H9CZTfQaRw"
    }

    from(fromName : string|null = null, fromAddress : string|null = null) {
        if (!fromName && process.env.MAIL_FROM_NAME) {
            fromName = process.env.MAIL_FROM_NAME
        }
        if(!fromAddress && process.env.MAIL_FROM_ADDRESS) {
            fromAddress = process.env.MAIL_FROM_ADDRESS
        }

        return `"${ fromName }" <${ fromAddress }>`
    }

    create() {
        return nodemailer.createTransport({
            host : this.host,
            port : this.port,
            secure : this.secure,
            auth : this.auth
        })
    }
}

export default new Transporter()



/* 
    const transporter = Transporter.create()

    transporter.sendMail({
        to: user.email,
        from: Transporter.from(),
        subject: 'Please confirm your email address',
        html: `<p><strong>Thanks for signing up to Live Quiz, We are happy to have you.</strong></p>
                <p>Please take a second to make sure we have your correct email address. <br/></p>
                <p><a href="${this.BASE_URL}/email/confirm/${user.id}?email=${user.email}"><strong>Confirm your email address</strong></a><br/></p>
                <p>Or try this code,</p>
                <p>Code : ${code} <br/><br/></p>
                <p>If you did not sign up for Live Quiz Account, you can safely ignore this email.</p>
                <p>Yours truly, <br/>
                Live Quiz Team <br/>
                <a href="${this.BASE_URL}">${this.BASE_URL}</a> <br/>
                The Drive to Develop</p>`

    }).then(function (info: SentMessageInfo) {

        const resetEmail = new ResetEmail({
            messageId: info.messageId,
            messageUrl: nodemailer.getTestMessageUrl(info)
        })
        resetEmail.save()
        response.send(user)

    }, function (err: any) {
        response.status(500).send({ message: err.message })
    }) 
*/
