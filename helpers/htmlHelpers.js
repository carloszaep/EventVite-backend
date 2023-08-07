import escapeHtml from 'escape-html'

// Helper function to generate the styled HTML confirmation page
export const generateConfirmationPage = (contactName, eventName, eventDate) => {
  const confirmationMessage = `Hello ${escapeHtml(contactName)}, you have successfully confirmed your attendance to the event: ${escapeHtml(eventName)} on ${escapeHtml(eventDate)}.`

  const confirmationPage = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Event Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); margin: 20px auto; max-width: 600px;">
        <h1 style="color: #333;">Event Confirmation</h1>
        <p>${confirmationMessage}</p>
        <p style="font-size: 14px; color: #777;">Please contact us if you have any questions.</p>
      </div>
    </body>
    </html>
  `

  return confirmationPage
}
