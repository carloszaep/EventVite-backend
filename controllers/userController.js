import { AppError } from '../utils/appError.js'
import User from '../models/usersModel.js'
import EventsApp from '../models/eventsModel.js'

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) throw new AppError('impossible to find user', 404)

    const userEvents = await EventsApp.find({ user: user.id }).select('-contacts')

    res.status(200).json({ data: { user, userEvents } })
  } catch (err) {
    next(err)
  }
}
