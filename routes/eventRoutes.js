import express from 'express'
import {
  confirmContact, createEvents, deleteEvent,
  updateEvent, getEvent, addContact, deleteContact,
  sendInvitation, protectEvent, sendPendingInvitations
} from '../controllers/eventsController.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

// create event
router.post('/createEvent', protect, createEvents)

// contact related
router.route('/:eventId/:contactId')
  .get(confirmContact)
  .delete(protect, protectEvent, deleteContact)
  .post(protect, protectEvent, sendInvitation)

// get and mod events
router.route('/:eventId')
  .get(protect, protectEvent, getEvent)
  .delete(protect, protectEvent, deleteEvent)
  .patch(protect, protectEvent, updateEvent)
  .put(protect, protectEvent, addContact)
  .post(protect, protectEvent, sendPendingInvitations)

export default router
