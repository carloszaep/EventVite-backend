import { AppError } from '../utils/appError.js'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import User from '../models/usersModel.js'
import { sendSms } from '../utils/sendSms.js'

const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  const cookieOptions = {
    expires: new Date(
      // 90 days
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: true,
    httpOnly: true,
    sameSite: 'strict'
  }

  res.cookie('token', token, cookieOptions)

  res.status(statusCode).json({
    status: 'ok',
    data: { user: { name: user.name, email: user.email, id: user._id } }
  })
}

export const signup = async (req, res, next) => {
  try {
    // set a token to save as verifyToken
    const token = crypto.randomBytes(8).toString('hex').toUpperCase()
    // create the user
    const newUser = await User.create({
      verificationToken: token,
      phone: req.body.phone,
      name: req.body.name
    })

    await sendSms(token, newUser.phone)

    res
      .status(201)
      .json({ data: { message: 'user was create need email verification' } })
  } catch (err) {
    next(new AppError(err.message, 404))
  }
}

export const login = async (req, res, next) => {
  try {
    const { phone, token } = req.body
    // set a token to save as verifyToken
    const user = await User.findOne({ phone }).select('+verificationToken')
    if (!user) throw new AppError('no user found', 404)

    if (!(await user.correctToken(token, user.verificationToken))) {
      throw new AppError('user or password no correct', 401)
    }

    createAndSendToken(user, 200, res)
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

export const resendToken = async (req, res, next) => {
  try {
    const { phone } = req.body
    // set a token to save as verifyToken
    const user = await User.findOne({ phone }).select('+verificationToken')
    if (!user) throw new AppError('no user found', 404)

    // set a token to save as verifyToken
    const token = crypto.randomBytes(8).toString('hex').toUpperCase()
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