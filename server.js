require('dotenv-safe').load()
const express = require('express')
const path = require('path')
const app = express()

// Define the port to run on
app.set('port', process.env.PORT)

// Set the static files directory
app.use(express.static(path.join(__dirname, 'build')))

// For client-side routing, always return the index page
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// Start the app
app.listen(app.get('port'), function () {
  console.log(`App running on port ${app.get('port')}...`)
})
