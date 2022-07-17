const mongoose = require('mongoose')

// from https://cloud.mongodb.com => Button 'Connect' => 'Connect your application'
const mongoDbCluster = process.env.MONGODB_CLUSTER
const mongoDbUser = process.env.MONGODB_USER
const mongoDbPw = process.env.MONGODB_PW
const url = `mongodb+srv://${mongoDbUser}:${mongoDbPw}@${mongoDbCluster}/?retryWrites=true&w=majority`
const urlNoPassword = `mongodb+srv://${mongoDbUser}:**********@${mongoDbCluster}/?retryWrites=true&w=majority`
if (!url) throw "MongoDB-URL is missing!"

mongoose.connect(url)
  .then(result => console.log(`connected to MongoDB: ${urlNoPassword}`))
  .catch(error => {
    console.log(`error connecting to MongoDB: ${urlNoPassword}`);
    console.log(`error-message: ${error}`);
  })


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: v => /^(\d+|\d{2,3}-\d+)$/.test(v),
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, 'Phone number is required']
  },
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
