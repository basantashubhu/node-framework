import express from 'express'
import dotenv from 'dotenv'
import {ServiceContainer} from './app/Container/ServiceContainer.js'
import cookieParser from 'cookie-parser'
// load env
dotenv.config()

// database connection
require('./database/mongoose')

const app: express.Application = express()
app.use(express.json())
app.use(express.urlencoded({ extended : true}))
app.use(cookieParser())

const serviceContainer = new ServiceContainer(app)
serviceContainer.run()

app.listen(process.env.PORT || 9000)