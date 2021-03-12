import { ServiceProvider } from "./ServiceProvider";

export class RouteServiceProvider extends ServiceProvider {
    boot() {}
    
    register() {
        this.mapRoutes()
        this.apiRoutes()

        // always should be in last
        this.errorRoutes()
    }

    mapRoutes() {
        this.app.use('/', require(process.cwd() + '/routes/web'))

        // authentication routes
        this.app.use('/', require(process.cwd() + '/routes/auth/route_auth'))
    }

    apiRoutes() {
        this.app.use('/api', require(process.cwd() + '/routes/api/api_route_auth'))
        this.app.use('/api', require(process.cwd() + '/routes/api/api_route_user'))
        this.app.use('/api', require(process.cwd() + '/routes/api/api_category'))
        this.app.use('/api', require(process.cwd() + '/routes/api/api_quiz'))
    }

    private errorRoutes() {
        this.app.use('/', require(process.cwd() + '/routes/route_errors'))
    }
}