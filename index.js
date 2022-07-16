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

// From exercise 3.8 (Custom logging)
morgan.token('type', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))


let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

// GET '/api' => Info page about the API
app.get('/api', (request, response) => {
  response.send('<div>' +
    '<h1>Hello</h1>' +
    '<ul>' +
    '<li>All persons (RESTful API): <a href="api/persons">persons</a></li>' +
    '<li>Info about persons: <a href="api/info">info</a></li>' +
    '</ul>' +
    '</div>')
})


// GET '/api/info' => Info about the phonebook
app.get('/api/info', (request, response) => {
  Person.find({}).then(persons => response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `))
})

// GET all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => response.json(people))
})

// GET individual person
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => response.json(person))
})

// Generate a new id
const generateRandomId = () => {
  const getRandom = () => Math.floor(Math.random() * 1_000_000_000)
  let random = getRandom()
  while (persons.find(person => person.id === random)) {
    random = getRandom()
  }
  return random
}

// POST a new person
app.post('/api/persons', (request, response) => {
  const body = request.body

  // Abort if there is no valid body
  if (!body.name || !body.number) return response.status(400).json({error: 'Name and/or number is missing (JSON expected)!'})

  // TODO: re-implement the following with the new remote MongoDB:
  // if (persons.find(p => p.name === body.name)) return response.status(400).json({error: 'Name must be unique!'})

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => response.json(savedPerson))
})

// DELETE a person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

// Run app (when on heroku, the PORT is assigned from process.env.PORT)
const PORT = process.env.PORT || 3001
const LOCAL_HOST_URL = process.env.LOCAL_HOST_URL
app.listen(PORT, () => {
  if (LOCAL_HOST_URL) console.log(`Server running at ${LOCAL_HOST_URL}:${PORT}`)
  else console.log(`Server running at Port=${PORT}`)
})
