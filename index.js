require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan');
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(cors())

/**
 * Serve the production-build of the frontend in folder /build
 * Was built from repo 'fullstackopen-2022', folder part3/lesson-code-frontend
 */
app.use(express.static('build'))


// Use morgan logging: https://github.com/expressjs/
// From exercise 3.7 (Standard logging)
//app.use(morgan('tiny'))

/**
 * From exercise 3.8 (Custom logging)
 */
morgan.token('type', function (req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

/**
 * GET '/api' => Info page about the API
 */
app.get('/api', (request, response) => {
  response.send('<div>' +
    '<h1>Hello</h1>' +
    '<ul>' +
    '<li>All persons (RESTful API): <a href="api/persons">persons</a></li>' +
    '<li>Info about persons: <a href="api/info">info</a></li>' +
    '</ul>' +
    '</div>')
})

/**
 * GET '/api/info' => Info about the phonebook
 */
app.get('/api/info', (request, response, next) => {
  Person.find({})
    .then(persons => response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `))
    .catch(error => next(error))
})

/**
 * GET all persons
 */
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(people => response.json(people))
    .catch(error => next(error))
})

/**
 * GET individual person
 */
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => response.json(person))
    .catch(error => next(error))
})

/**
 * POST a new person
 */
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})

/**
 * PUT: Change a person
 */
app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    {name, number},
    {new: true, runValidators: true, context: 'query'}
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

/**
 * DELETE a person
 */
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => response.status(204).end())
    .catch(error => next(error))
})


/**
 * Answer for all other (unknown) endpoints)
 */
const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint!'})
}
app.use(unknownEndpoint)

/**
 * Error handler middleware
 */
const errorHandler = (error, request, response, next) => {
  console.log(error)
  response.status(400).send({
    error: error.name,
    errorMessage: error.message
  })
}
app.use(errorHandler)

/**
 * Run app
 */
const PORT = process.env.PORT
const LOCAL_HOST_URL = process.env.LOCAL_HOST_URL
app.listen(PORT, () => {
  if (LOCAL_HOST_URL) console.log(`Server running at ${LOCAL_HOST_URL}:${PORT}`)
  else console.log(`Server running at Port=${PORT}`)
})
