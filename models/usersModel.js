import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'event need a name'],
      maxlength: [100, 'no more of 100 characters'],
      minlength: [1, 'no less that 1 characters']
    },

    phone: {
      type: String,
      unique: true,
      required: [true, 'please enter a phone number'],
      validate: {
        validator: function (val) {
          return val.startsWith('+1')
        },
        message: 'phone number had to start with +1'
      }
    },

    verificationToken: { type: String, select: false, required: [true, 'need a token'] },
    tokenChangeAt: {
      type: Date,
      default: Date.now
    },

    active: { type: Boolean, default: true, select: false }
  }
)

userSchema.index({ phone: 1 })

// set tokenChangeAt whenever the user change token
userSchema.pre('save', async function (next) {
  if (!this.isModified('verificationToken') || this.isNew) return next()

  this.tokenChangeAt = Date.now() - 1000
})

// hash user verificationToken whenever save() is use
userSchema.pre('save', async function (next) {
  // only run this function id verificationToken was modified
  if (!this.isModified('verificationToken')) return next()

  // hash the verificationToken

  this.verificationToken = await bcrypt.hash(this.verificationToken, 12)

  next()
})

userSchema.methods.correctToken = async function (
  candidateToken,
  verificationToken
) {
  return await bcrypt.compare(candidateToken, verificationToken)
}

userSchema.methods.changeTokenAfter = function (JWTTimestamp) {
  if (this.tokenChangeAt) {
    // get data and because is in millisecond had to divvied by 1000, and parseInt to get a integer
    const changeTimestamp = parseInt(
      this.tokenChangeAt.getTime() / 1000,
      10
    )
    // if this is true mean that password was change
    return changeTimestamp > JWTTimestamp
  }

  // false mean NOT change
  return false
}

const User = mongoose.model('User', userSchema)

export default User
