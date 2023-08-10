import dotenv from 'dotenv'
import mongoose from 'mongoose'
import fetch from 'node-fetch'
import app from './app.js'

dotenv.config({ path: './conf.env' })

// get ip for FL0 to add to db
fetch('http://api.ipify.org')
  .then(response => response.text())
  .then(ip => {
    console.log(`Your public IP address is: ${ip}`)
  })
  .catch(error => {
    console.error('Error:', error)
  })

mongoose
  .connect(process.env.URI_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('connected to DB')
  })
  .catch((err) => console.error(err))

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`your app is running on port ${PORT}`)
})
