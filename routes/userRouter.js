import express from 'express'

import {
  signup,
  login,
  resendToken,
  protect,
  logout

} from '../controllers/authController.js'
import { updateMe, getMe } from '../controllers/userController.js'

const router = express.Router()

// auth related
router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.post('/resendToken', resendToken)

// user relate
router.get('/getMe', protect, getMe)
router.patch('/updateMe', protect, updateMe)

export default router
