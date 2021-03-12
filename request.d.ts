declare namespace Express {
    interface Auth {
        user(key : string|null = null)
        id()
    }

    export interface Request {
        decoded?: object,
        auth?: Auth
    }
}