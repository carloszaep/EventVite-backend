import { AppError } from '../utils/appError.js'
import EventsApp from '../models/eventsModel.js'
import { generateConfirmationPage } from '../helpers/htmlHelpers.js'
import { sendInvitationSms } from '../helpers/smsToContactHelpers.js'

export const createEvents = async (req, res, next) => {
  try {
    const { name, eventDate, contacts } = req.body

    // get user
    const user = req.user

    // create event
    const event = await EventsApp.create({ name, eventDate, contacts, user: user.id })

    // send sms for each contact

    for (const contact of event.contacts) {
      const isSmsSent = await sendInvitationSms(user, event, contact, req)

      if (isSmsSent) {
        contact.notify = true
        await event.save()
      }
    }

    res
      .status(201)
      .json({ data: { event } })
  } catch (err) {
    next(err)
  }
}

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
    const confirmationPage = generateConfirmationPage(contact.name, event.name, event.eventDate)

    res.send(confirmationPage)
  } catch (err) {
    next(err)
  }
}

export const getEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params

    const user = req.user

    // Find the event by eventId and update contact confirmation
    const event = await EventsApp.findById(eventId)

    if (!event) {
      throw new AppError('Event not found', 404)
    }

    if (event.user.toString() !== user.id) throw new AppError('this is no your event', 401)

    res.status(200).json({ data: event })
  } catch (err) {
    next(err)
  }
}

export const deleteEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params

    const user = req.user

    // Find the event by eventId and update contact confirmation
    const event = await EventsApp.findById(eventId)

    if (!event) {
      throw new AppError('Event not found', 404)
    }

    if (event.user.toString() !== user.id) throw new AppError('this is no your event', 401)

    await event.delete()

    res.status(200).json({ data: event })
  } catch (err) {
    next(err)
  }
}

export const updateEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params
    const fieldToUpdate = {}

    const {
      name, eventDate
    } = req.body
    if (name) fieldToUpdate.name = name
    if (eventDate) fieldToUpdate.eventDate = eventDate

    const user = req.user

    // Find the event by eventId and update contact confirmation
    const event = await EventsApp.findById(eventId)

    if (!event || event.user.toString() !== user.id) {
      throw new AppError('Event not found or you are no the owner', 401)
    }

    if (fieldToUpdate.name) event.name = name
    if (fieldToUpdate.eventDate) event.eventDate = eventDate

    await event.save()

    res.status(200).json({ data: event })
  } catch (err) {
    next(err)
  }
}

export const deleteContact = async (req, res, next) => {
  try {
    const { eventId, contactId } = req.params
    const user = req.user

    // Find the event by eventId and update contacts
    const event = await EventsApp.findById(eventId)

    if (!event || event.user.toString() !== user.id) {
      throw new AppError('Event not found or you are no the owner', 401)
    }

    // Find the index of the contact to be deleted
    const contactIndex = event.contacts.findIndex((c) => c.id === contactId)

    if (contactIndex === -1) {
      throw new AppError('Contact not found', 404)
    }

    // Remove the contact from the contacts array
    event.contacts.splice(contactIndex, 1)

    await event.save()

    res.status(200).json({ data: event })
  } catch (err) {
    next(err)
  }
}

export const addContact = async (req, res, next) => {
  try {
    const { eventId } = req.params
    const { newContact } = req.body
    const user = req.user

    // Find the event by eventId and update contacts
    const event = await EventsApp.findById(eventId)

    if (!event || event.user.toString() !== user.id) {
      throw new AppError('Event not found or you are no the owner', 401)
    }

    // Find the index of the contact to be deleted
    event.contacts.push(newContact)

    await event.save()

    res.status(200).json({ data: event })
  } catch (err) {
    next(err)
  }
}

export const sendSmsToContact = async (req, res, next) => {
  try {
    const { eventId, contactId } = req.params
    const user = req.user

    // Find the event by eventId
    const event = await EventsApp.findById(eventId)

    if (!event || event.user.toString() !== user.id) {
      throw new AppError('Event not found or you are no the owner', 401)
    }

    const contact = event.contacts.find((c) => c.id === contactId)

    if (!contact) {
      throw new AppError('Contact not found', 404)
    }

    if (contact.confirmed || contact.notify) throw new AppError('is already confirmed ot notify', 401)

    // send sms to contact
    const isSmsSent = await sendInvitationSms(user, event, contact, req)

    if (isSmsSent) {
      contact.notify = true
      await event.save()
    }

    res.status(200).json({ data: { message: 'sms send to contact' } })
  } catch (err) {
    next(err)
  }
}
