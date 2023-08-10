import dotenv from 'dotenv'
import { AppError } from '../utils/appError.js'
import fetch from 'node-fetch'

dotenv.config({ path: './conf.env' })
// Find your Service Plan ID and API Token at dashboard.sinch.com/sms/api/rest
// Find your Sinch numbers at dashboard.sinch.com/numbers/your-numbers/numbers
const SERVICE_PLAN_ID = process.env.SERVICE_PLAN_ID
const API_TOKEN = process.env.API_TOKEN
const SINCH_NUMBER = process.env.SINCH_NUMBER

export const sendSms = async (smsText, toPhoneNumber) => {
  try {
    const resp = await fetch(
      'https://us.sms.api.sinch.com/xms/v1/' + SERVICE_PLAN_ID + '/batches',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + API_TOKEN
        },
        body: JSON.stringify({
          from: SINCH_NUMBER,
          to: ['+17866161600'],
          body: smsText
        })
      }
    )

    const data = await resp.json()

    return data
  } catch (err) {
    throw new AppError(err.messages, 404)
  }
}
