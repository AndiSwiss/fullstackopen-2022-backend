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

// GET '/' => hello world
app.get('/', (request, response) => {
  response.send('<h1>Hello</h1><p>Go to <a href="api/persons">api/persons</a>.</p>')
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
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

// POST a new person
app.post('/api/persons', (request, response) => {
  const body = request.body

  // Abort if there is no valid body
  if (!body.name) return response.status(400).json({error: 'name is missing (JSON expected)'})

  const person = {
    id: generateId(),
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
