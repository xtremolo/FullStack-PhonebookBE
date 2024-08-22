const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("tinyplus", function (req, res) {
  return JSON.stringify(req.body);
});

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]; // persons

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :tinyplus"
  )
);

// routes
app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
  //response.send(persons);
});

app.get("/info", (request, response) => {
  const time = Date();

  response.send(`Phonebook has info for ${persons.length} people
    <br><br>${Date()}`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return String(Math.floor(Math.random() * persons.length * 100000000));
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  //  console.log(body);

  // no content sent with request
  if (!body) {
    return response.status(400).json({
      error: "missing content",
    });
  }

  // name or number missing
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "missing name or number",
    });
  }

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
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
  //  persons = persons.concat(person);
}); // routes

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
