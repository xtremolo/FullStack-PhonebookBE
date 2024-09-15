const mongoose = require('mongoose')

const generateId = () => {
  return String(Math.floor(Math.random() * 100000000))
}

if (process.argv.length < 3) {
  console.log('Give password as argument')
  process.exit(1)
}
if (process.argv.length > 5) {
  console.log('Too many parameters')
  process.exit(1)
}
// TODO 4 arguments; bring others here
if (process.argv.length == 4) {
  console.log(
    'Usage: node mongo.js <password> OR node mongo.js <password> <name> <number>'
  )
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://erraticum:${password}@notes.ptfgd.mongodb.net/Fullstack?retryWrites=true&w=majority&appName=notes`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// add person to phonebook
if (process.argv.length == 5) {
  const personsName = process.argv[3]
  const personsNumber = process.argv[4]

  const person = new Person({
    id: generateId(),
    name: personsName,
    number: personsNumber,
  })

  person.save().then((result) => {
    console.log(`Added ${personsName} number ${personsNumber} to phonebook`)
    mongoose.connection.close()
  })
}
// get all entries
else if (process.argv.length == 3) {
  Person.find({}).then((result) => {
    console.log('Phonebook:')
    //    console.log(result);

    result.forEach((person) => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
