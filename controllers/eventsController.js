import { AppError } from '../utils/appError.js'
import EventsApp from '../models/eventsModel.js'
import { generateConfirmationPage } from '../helpers/htmlHelpers.js'
import { sendInvitationSms } from '../helpers/smsToContactHelpers.js'
import { validateEvent, validatePartialEvent } from '../schemas/eventsSchema.js'
import { validateContact } from '../schemas/contactsSchema.js'

export const createEvents = async (req, res, next) => {
  try {
    // validate body inputs
    const result = validateEvent(req.body)
    if (!result.success) return res.status(400).json(JSON.parse(result.error.message))

    // get user
    const user = req.user

    // create event
    const event = await EventsApp.create({ ...result.data, user: user.id })

    res.status(201).json({ data: { event } })
  } catch (err) {
    next(err)
  }
}

export const getEvent = async (req, res, next) => {
  try {
    const event = req.event

    res.status(200).json({ data: event })
  } catch (err) {
    next(err)
  }
}

export const deleteEvent = async (req, res, next) => {
  try {
    const event = req.event

    await event.delete()

    res.status(200).json({ data: event })
  } catch (err) {
    next(err)
  }
}

export const updateEvent = async (req, res, next) => {
  try {
    const result = validatePartialEvent(req.body)
    if (!result.success) return res.status(400).json(JSON.parse(result.error.message))

    const event = await EventsApp.findByIdAndUpdate(
      req.event.id, result.data,
      { new: true, runValidators: true })

    res.status(200).json({ data: event })
  } catch (err) {
    next(err)
  }
}

// contact related endpoint

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params

    // Find the event by eventId and update contacts
    const event = req.event

    // remove contact and save event
    await event.deleteContact(contactId)

    res.status(200).json({ data: event })
  } catch (err) {
    next(err)
  }
}

export const addContact = async (req, res, next) => {
  try {
    const result = validateContact(req.body)
    if (!result.success) {
      return res.status(400).json(JSON.parse(result.error.message))
    }

    const event = req.event

    // Add the contact and save event
    await event.addContact(result.data)

    res.status(200).json({ data: event })
  } catch (err) {
    next(err)
  }
}

export const sendInvitation = async (req, res, next) => {
  try {
    const { contactId } = req.params

    // get event
    const event = req.event

    // get user
    const user = req.user

    // find contact
    const contact = event.contacts.find((c) => c.id === contactId)

    if (!contact) {
      throw new AppError('Contact not found', 404)
    }

    if (contact.confirmed) throw new AppError('is already confirmed', 401)

    // send sms to contact
    const isSmsSent = await sendInvitationSms(user, event, contact, req)

    if (isSmsSent) {
      contact.notify = true
      await event.save()
    }

    res.status(200).json({ data: { message: 'SMS notification sent successfully' } })
  } catch (err) {
    next(err)
  }
}

export const sendPendingInvitations = async (req, res, next) => {
  try {
    const event = req.event

    // Filter unconfirmed and unNotified contacts
    const unconfirmedUnnoticedContacts = event.contacts.filter(
      contact => !contact.confirmed && !contact.notify
    )

    // Get the user
    const user = req.user

    // Send SMS to each unconfirmed and unNotified contact
    for (const contact of unconfirmedUnnoticedContacts) {
      const isSmsSent = await sendInvitationSms(user, event, contact, req)
      if (isSmsSent) {
        contact.notify = true
      }
    }

    // Save the updated event with contacts' notify status
    await event.save()

    res.status(200).json({ data: { message: 'SMS notifications sent successfully' } })
  } catch (err) {
    next(err)
  }
}

// webhook or similar
export const confirmContact = async (req, res, next) => {
  try {
    const { eventId, contactId } = req.params

    // Find the event by eventId and update contact confirmation
    const event = await EventsApp.findById(eventId)

    if (!event) {
      throw new AppError('Event not found', 404)
    }

    const contact = event.contacts.find((c) => c.id === contactId)

    if (!contact) {
      throw new AppError('Contact not found', 404)
    }

    contact.confirmed = true

    await event.save()

    // Generate the styled HTML confirmation page using the helper function
    const confirmationPage = generateConfirmationPage(contact, event)

    res.send(confirmationPage)
  } catch (err) {
    next(err)
  }
}

// middleware function
export const protectEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params

    // get user id
    const userId = req.user.id

    // Perform ownership check
    const event = await EventsApp.findById(eventId)

    if (!event) throw new AppError('Event not found', 404)

    if (event.user.toString() !== userId) throw new AppError('You are not the owner of this event', 401)

    // If ownership check passes
    req.event = event
    next()
  } catch (err) {
    next(err)
  }
}
