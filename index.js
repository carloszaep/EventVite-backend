import dotenv from 'dotenv'
import mongoose from 'mongoose'
import app from './app.js'

dotenv.config({ path: './conf.env' })

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
