const express=require('express');
const router = express.Router()
const {addContact} = require('../Controller/contact-controller')
const {getContacts,updateContact,deleteContact} = require('../Controller/contact-controller')
const protect = require('../middleware/auth-middleware')

router.route('/contact').post(protect,addContact)
router.route('/contact/update').patch(protect,updateContact)
router.route('/get/contact').get(protect,getContacts)
router.route('/delete/contact/:id').delete(protect,deleteContact)

module.exports=router;