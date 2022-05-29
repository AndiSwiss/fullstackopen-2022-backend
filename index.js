const express = require('express')
const app = express()

app.use(express.json())

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

// GET '/' => Welcome page
app.get('/', (request, response) => {
  response.send('<div>' +
    '<h1>Hello</h1>' +
    '<ul>' +
    '<li>All persons (RESTful API): <a href="api/persons">api/persons</a></li>' +
    '<li>Info about persons: <a href="info">info</a></li>' +
    '</ul>' +
    '</div>')
})

// GET '/info' => Info about the phonebook
app.get('/info', (request, response) => {
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
  if (!body.name) return response.status(400).json({error: 'name is missing (JSON expected)'})

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
  console.log(`Server running at http://localhost:${PORT}`)
})
