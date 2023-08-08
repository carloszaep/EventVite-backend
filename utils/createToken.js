import crypto from 'crypto'

export function createToken () {
  return crypto.randomBytes(8).toString('hex').toUpperCase()
}
