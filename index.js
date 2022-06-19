const express = require('express')
const cors = require('cors')
const morgan = require('morgan');
const app = express()

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
  response.send(`
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>
  `)
})

// GET all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// GET individual person
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id) // Don't forget to convert from string to Number
  const person = persons.find(person => person.id === id)
  if (person) response.json(person)
  else response.status(404).end()
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
  if (persons.find(p => p.name === body.name)) return response.status(400).json({error: 'Name must be unique!'})


  const person = {
    id: generateRandomId(),
    name: body.name,
    number: body.number || '',
  }
  persons = persons.concat(person)
  response.json(person)
})

// DELETE a person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

// Run app
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running at Port=${PORT}`)
})
