import multer from "multer";
import Request = Express.Request;

const filter = function (request : Request, file : Express.Multer.File, cb : (error: (Error | null), filter: boolean) => void) {
    if (file.mimetype.indexOf('image/') !== -1) {
        cb(null, false)
    } else {
        cb(null, true)
    }
}

const storage = multer.diskStorage({
    destination(request : Request, file : Express.Multer.File, cb : (error: (Error | null), location: string) => void) {
        cb(null, './files')
    },
    filename(request: Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
        let filename: string = new Date().getTime().toString()
        if (request.auth?.user('first_name')) {
            filename += '_' + request.auth?.user('first_name')
        }
        filename += '_' + file.originalname.replace(' ', '_')
        callback(null, filename)
    }
})

const upload = multer({storage})

module.exports = upload