import { AppError } from '../utils/appError.js'
import EventsApp from '../models/eventsModel.js'
import User from '../models/usersModel.js'
import { validatePartialUser } from '../schemas/userSchema.js'

export const getMe = async (req, res, next) => {
  try {
    const user = req.user

    const userEvents = await EventsApp.find({ user: user.id }).select('-contacts')

    res.status(200).json({ data: { user, userEvents } })
  } catch (err) {
    next(new AppError(err.message, 404))
  }
}

export const updateMe = async (req, res, next) => {
  try {
    const result = validatePartialUser(req.body)
    if (!result.success) {
      return res.status(400).json(JSON.parse(result.error.message))
    }

    // get user
    const user = await User.findByIdAndUpdate(
      req.user.id, result.data,
      { new: true, runValidators: true })

    res.status(200).json({ data: { user } })
  } catch (err) {
    next(new AppError(err.message, 404))
  }
}
