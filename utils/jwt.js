import jwt from 'jsonwebtoken'

const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })

export const createAndSendToken = (user, statusCode, res) => {
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
