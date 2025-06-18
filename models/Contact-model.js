// models/User.js
const{Schema,model} = require('mongoose')

const addContact = new Schema({
    chatContacts: [
        {
          username: String,
          number: String,
        }
      ]
})
const Contact = new model('Contact',addContact)
module.exports=Contact;
  