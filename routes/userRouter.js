import express from 'express'

import {
  signup,
  login,
  resendToken,
  protect

} from '../controllers/authController.js'
import { getMe } from '../controllers/userController.js'

const router = express.Router()

// auth related
router.post('/signup', signup)
router.post('/login', login)
router.post('/resendToken', resendToken)

// user relate
router.get('/getMe', protect, getMe)

export default router
