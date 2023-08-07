import { sendSms } from '../utils/sendSms.js'

const generateConfirmationLink = (req, eventId, contactId) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`
  return `${baseUrl}/api/v1/events/${eventId}/${contactId}`
}

const formatEventDate = (eventDate) => {
  return new Date(eventDate).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })
}

export const sendInvitationSms = async (user, event, contact, req) => {
  const formattedEventDate = formatEventDate(event.eventDate)
  const contactName = contact.name
  const contactPhone = contact.phone
  const eventId = event.id
  const contactId = contact.id

  const confirmationLink = generateConfirmationLink(req, eventId, contactId)
  const htmlConfirmationLink = `<a href="${confirmationLink}">Confirm</a>`

  const htmlMessage = `
    Hello ${contactName}, ${user.name} just invited you to the event: ${event.name},
    on ${formattedEventDate}, please confirm if you're going by visiting this link: ${htmlConfirmationLink}`

  const sentSms = await sendSms(htmlMessage, contactPhone)

  return sentSms
}
