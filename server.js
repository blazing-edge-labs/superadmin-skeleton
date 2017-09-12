const express = require('express')
const path = require('path')
const app = express()

// Define the port to run on
app.set('port', 9000)

// Set the static files directory
app.use(express.static(path.join(__dirname, 'build')))

app.get('/*', function (req, res) {
  res.sendFile('index.html')
})

app.listen(app.get('port'), function () {
  console.log(`App running on port ${app.get('port')}...`)
})
