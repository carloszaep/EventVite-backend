import mongoose from 'mongoose'

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
    eventDate: {
      type: Date,
      required: [true, 'please add date to event']
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
        }
      },
      notify: { type: Boolean, default: false },
      confirmed: { type: Boolean, default: false }
    }]
  }

)

const EventsApp = mongoose.model('EventsApp', eventsSchema)

export default EventsApp
