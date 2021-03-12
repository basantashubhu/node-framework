import { ServiceProvider } from "./ServiceProvider"
import hbs from 'hbs'
import path from 'path'
import express from 'express'
import morgan from 'morgan'

const layouts = require('handlebars-layouts')

export class AppServiceProvider extends ServiceProvider{
    boot() {

    }
    
    register() {
        hbs.handlebars.registerHelper(layouts(hbs.handlebars))
        hbs.registerPartials(path.join(process.cwd(), 'views', 'partials'))
        hbs.registerPartials(path.join(process.cwd(), 'views', 'template'))
        this.app.set('view engine', 'hbs')
        this.app.use(express.static('public'))
        if (process.env.NODE_ENV === 'development') {
            this.app.use(morgan('dev'))
        }
    }
}