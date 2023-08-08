import mongoose from 'mongoose'
import { AppError } from '../utils/appError.js'

const eventsSchema = new mongoose.Schema(
  {
    createAt: {
      type: Date,
      default: Date.now
    },
    name: {
      type: String,
      required: [true, 'event need a name'],
      maxlength: [100, 'no more of 100 characters'],
      minlength: [1, 'no less that 1 characters']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'need a user ']
    },
    address: {
      type: String
    },

    eventDate: {
      type: Date,
      required: [true, 'please add date to event'],
      validate: {
        validator: function (value) {
          return value > new Date() // Check if the eventDate is in the future
        },
        message: 'eventDate must be set to a future date and time'
      }
    },
    contacts: [{
      name: {
        type: String,
        required: [true, 'event need a name'],
        maxlength: [100, 'no more of 100 characters'],
        minlength: [1, 'no less that 1 characters']
      },
      phone: {
        type: String,
        required: [true, 'please enter a phone number'],
        validate: {
          validator: function (val) {
            return /^(\+1)/.test(val)
          },
          message: 'phone number had to start with +1'
        },
        maxlength: [12, 'no more that 12'],
        minlength: [12, 'no less that 12']
      },
      notify: { type: Boolean, default: false },
      confirmed: { type: Boolean, default: false }
    }]
  }

)

// Instance method to delete a contact
eventsSchema.methods.deleteContact = async function (contactId) {
  try {
    const contactIndex = this.contacts.findIndex((contact) => contact.id === contactId)
    if (contactIndex !== -1) {
      this.contacts.splice(contactIndex, 1)
      await this.save()
    } else {
      throw new AppError('Contact not found', 404)
    }
  } catch (error) {
    throw new AppError(error.message, 404)
  }
}
// Instance method to add a contact
eventsSchema.methods.addContact = async function (contactData) {
  try {
    this.contacts.push(contactData)
    await this.save()
  } catch (error) {
    throw new AppError(error.message, 404)
  }
}

const EventsApp = mongoose.model('EventsApp', eventsSchema)

export default EventsApp
