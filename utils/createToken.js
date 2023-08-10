import crypto from 'crypto'

export function createToken () {
  return crypto.randomBytes(4).toString('hex').toUpperCase()
}
