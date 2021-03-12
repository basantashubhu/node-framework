export class Singleton {
    private static instance : any = null

    static getInstance() : any {
        if (this.instance == null) {
            this.instance = new this()
        }
        return this.instance
    }
}