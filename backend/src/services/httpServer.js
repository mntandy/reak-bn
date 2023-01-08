const express = require('express')
const cors = require('cors')

const app = express()


app.use(express.json())
app.use(express.static('build'))

app.use(cors())

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
  
const errorHandler = (error, request, response, next) => {
	console.error(error.message)
	next(error)
}

app.use(errorHandler)

module.exports = app.listen(8080, () => {
  console.log('listening for requests on port 8080')
})