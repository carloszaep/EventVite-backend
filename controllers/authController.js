import { AppError } from '../utils/appError.js'
import jwt from 'jsonwebtoken'
import { createToken } from '../utils/createToken.js'
import { promisify } from 'util'
import User from '../models/usersModel.js'
import { sendSms } from '../utils/sendSms.js'
import { validateUser } from '../schemas/userSchema.js'
import { validateLogin, validatePhone } from '../schemas/loginSchema.js'
import { createAndSendToken } from '../utils/jwt.js'

export const signup = async (req, res, next) => {
  try {
    const result = validateUser(req.body)
    if (!result.success) {
      return res.status(400).json(JSON.parse(result.error.message))
    }
    // set a token to save as verifyToken
    const token = createToken()
    // create the user
    const user = await User.create({
      verificationToken: token, ...result.data
    })

    // send token to user
    await sendSms(token, user.phone)

    res
      .status(201)
      .json({ data: { message: 'user was create need email verification' } })
  } catch (err) {
    next(new AppError(err.message, 404))
  }
}

export const login = async (req, res, next) => {
  try {
    const result = validateLogin(req.body)
    if (!result.success) {
      return res.status(400).json(JSON.parse(result.error.message))
    }

    const { phone, token } = result.data
    // set a token to save as verifyToken
    const user = await User.findOne({ phone }).select('+verificationToken +active')
    if (!user) throw new AppError('user or password no correct', 400)

    if (!user.active) throw new AppError('this user was remove', 404)

    if (user.isLocked) {
      if ((await user.checkLockDown())) throw new AppError('this user is lock', 401)
    }

    if (!(await user.correctToken(token, user.verificationToken))) {
      await user.failedLogin()
      throw new AppError('user or password no correct', 401)
    }

    await user.resetFailedLoginAttempts()

    createAndSendToken(user, 200, res)
  } catch (err) {
    next(err)
  }
}

export const resendToken = async (req, res, next) => {
  try {
    const result = validatePhone(req.body)

    if (!result.success) {
      return res.status(400).json(JSON.parse(result.error.message))
    }

    const { phone } = result.data

    // set a token to save as verifyToken
    const user = await User.findOne({ phone }).select('+verificationToken')
    if (!user) throw new AppError('no user found', 404)

    // set a token to save as verifyToken
    const token = createToken()
    user.verificationToken = token

    await user.save()

    await sendSms(token, user.phone)

    res
      .status(201)
      .json({ data: { message: 'new token was send' } })
  } catch (err) {
    next(err)
  }
}

// middleware function
export const protect = async (req, res, next) => {
  try {
    // check for the token in the header
    const { token } = req.cookies

    if (!token) throw new AppError('you are no login, please login', 401)
    // decoded user id by the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    // check if user still exists
    const currentUser = await User.findById(decoded.id).select('+active')
    if (!currentUser) throw new AppError('user does not longer exist', 400)
    if (!currentUser.active) throw new AppError('this user was remove', 404)
    // check if user change password
    if (currentUser.changeTokenAfter(decoded.iat)) { throw new AppError('user recently change password, please log in again', 401) }

    // grant access to protected route
    req.user = currentUser
    next()
  } catch (err) {
    next(err)
  }
}

export const logout = async (req, res, next) => {
  try {
    res.cookie('token', '', {
      expires: new Date(0)
    })
    res.sendStatus(200)
  } catch (err) {
    next(new AppError(err.message, 404))
  }
}
