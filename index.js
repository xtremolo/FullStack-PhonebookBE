const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('tinyplus', function (req, res) {
  return JSON.stringify(req.body)
})

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
] // persons

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :tinyplus'
  )
)

// routes
app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people)
  })
  //response.send(persons);
})

app.get('/info', (request, response) => {
  //  const time = Date();

  Person.find({}).then((people) => {
    response.send(`Phonebook has info for ${people.length} people
      <br><br>${Date()}`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then((personFound) => {
      if (personFound) {
        response.json(personFound)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
  //   {
  //   console.log(error);
  //   response.status(400).send({ error: "malformed id" });
  // }); // persons.find((p) => p.id === id);

  // if (person) {
  //   response.json(person);
  // } else {
  //   response.status(404).end();
  // }
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))

  // persons = persons.filter((p) => p.id !== id);
  // response.status(204).end();
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  // OR
  // const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))

  // persons = persons.filter((p) => p.id !== id);
  // response.status(204).end();
})

// not in use anymore, id generated by MongoDB
const generateId = () => {
  return String(Math.floor(Math.random() * persons.length * 100000000))
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // no content sent with request
  // if (!body) {
  //   return response.status(400).json({
  //     error: "missing content",
  //   });
  // }

  // name or number missing
  // if (!body.name || !body.number) {
  //   return response.status(400).json({
  //     error: "missing name or number",
  //   });
  // }

  // name already in the phonebook
  // const nameIdx = persons.findIndex((p) => p.name === body.name);
  // if (nameIdx !== -1) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  const person = new Person({
    //id: generateId(),
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
  //  persons = persons.concat(person);
}) // routes

// error handling
const errorHandler = (error, request, response, next) => {
  console.log(error.name, '-', error.message)

  // delete
  if (error.name === 'CastError') {
    //console.log("CastError");
    return response.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    //console.log("ValidationError");
    //return response.status(400).json({ error: error.message });
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'TypeError') {
    //console.log("TypeError");
    //    return response.status(410).json({ error: error.message });
    return response.status(410).json({ error: error })
  }

  console.log('Error type not recognized')

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
