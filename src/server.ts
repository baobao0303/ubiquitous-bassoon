import express, { Application, NextFunction, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import appRoutes from './globals/routes/appRoutes'
import { CustomError, NotFoundException } from './globals/cores/error.core'
import HTTP_STATUS from './globals/constants/http.constant'
import 'dotenv/config'

class Server {
  private app: Application

  constructor() {
    this.app = express()
  }

  public start(): void {
    this.setupMiddleware()
    this.setupRoutes()
    this.setupGlobalError()
    this.listenServer()
  }

  private setupMiddleware() {
    this.app.use(express.json())
    this.app.use(cookieParser())
  }
  private setupRoutes() {
    appRoutes(this.app) // /users, /jobs, etc
  }
  private setupGlobalError() {
    // all = [get, post, put, patch, delete];
    this.app.all('*', (req, res, next) => {
      // res.status(404).json({
      //   message: `The URL ${req.originalUrl} not found with method ${req.method}`
      // })
      next(new NotFoundException(`The URL ${req.originalUrl} not found with method ${req.method}`))
    })
    //next(new BadRequestException('The URL ${req.originalUrl}))

    // Global Error Handler => error, req, next, res
    this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message
        })
      }
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong!!!'
      })
    })
  }

  private listenServer() {
    const port = process.env.port || 5050

    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  }
}
export default Server
