import express from 'express'
import {
  confirmContact, createEvents, deleteEvent,
  updateEvent, getEvent, addContact, deleteContact,
  sendSmsToContact
} from '../controllers/eventsController.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

// create event
router.post('/createEvent', protect, createEvents)

// contact related
router.route('/:eventId/:contactId')
  .get(confirmContact)
  .patch(protect, deleteContact)
  .post(protect, sendSmsToContact)

// get and mod events
router.route('/:eventId')
  .get(protect, getEvent)
  .delete(protect, deleteEvent)
  .patch(protect, updateEvent)
  .put(protect, addContact)

export default router
