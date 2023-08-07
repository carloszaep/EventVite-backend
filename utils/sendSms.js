import dotenv from 'dotenv'
import { AppError } from '../utils/appError.js'
import Twilio from 'twilio'

dotenv.config({ path: './conf.env' })

const client = Twilio(process.env.twilioSid, process.env.twilioToken)

export const sendSms = async (sms, toPhoneNumber) => {
  try {
    const sendedSms = 'sms sended to consoled.log'

    console.log(sms)

    // const sendedSms = await client.messages.create({
    //   body: sms,
    //   from: '+18664851989',
    //   to: toPhoneNumber
    // })

    return sendedSms
  } catch (err) {
    throw new AppError(err.messages, 404)
  }
}
