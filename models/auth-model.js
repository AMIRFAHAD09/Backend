const{Schema,model} = require('mongoose');
const { required } = require('../validator/auth-validator');

const contactSchema = new Schema({
    username: String,
    number: String
  });
  const messageSchema = new Schema(
        {
          from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          to: { type: Schema.Types.ObjectId, ref: "User", required: true },
          content: String,
          timestamp: { type: Date, default: Date.now },
        //   fromMe: Boolean, // true if this user sent the message
        }
  )
const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        match: [/^\d{10}$/, 'Phone number must be exactly 10 digits']
    },
    // unique_name:{
    //     type:String,
    //     required:true
    // },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    chatContacts: [contactSchema],
    messages:[messageSchema]
})

const User = new model('User',userSchema)
module.exports=User;