const mongoose = require('mongoose')
const URL = process.env.MONGO_URI

mongoose.connect(URL).catch(err => {
    console.error('Initial DB connection error: ', err.message)
})
mongoose.Promise = global.Promise

const db = mongoose.connection
db.on('error', console.error.bind(console, 'DB ERROR: '))

module.exports = {db, mongoose}
