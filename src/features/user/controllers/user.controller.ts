import { NextFunction, Request, Response } from 'express'
import { userService } from '../services/user.service'
import { userCreateSchema } from '../schemas/user.schema'
import HTTP_STATUS from '~/globals/constants/http.constant'

class UserController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const users = await userService.getAllUser()
    res.status(200).json({
      message: 'Get all users successfully',
      data: users
    })
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    const { error } = userCreateSchema.validate(req.body)
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Validation error',
        error
      })
    }
    const user = await userService.createUser(req.body)
    res.status(201).json({
      message: 'Create user successfully',
      data: user
    })
  }
}

export const userController: UserController = new UserController()
