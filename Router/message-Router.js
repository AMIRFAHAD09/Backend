const express=require('express');
const router = express.Router()
const protect = require('../middleware/auth-middleware')
const {storeMessage,getMessages,clearMessages} = require('../Controller/message-controller')

router.route('/store').post(protect,storeMessage)
// Get messages between two users
router.route('/history/:userId/:contactId').get(protect, getMessages);
//clear chat 
router.route('/delete/:userId/:contactId').delete(protect, clearMessages);
module.exports=router;