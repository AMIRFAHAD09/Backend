const express = require('express');
const router = express.Router()
const authController = require('../Controller/auth-controller')
const protect = require('../middleware/auth-middleware')

// for registration validation
const signupSchema = require('../validator/auth-validator')
const validate = require('../middleware/validator-middleware')

router.route('/register').post(validate(signupSchema),authController.register);
router.route('/login').post(authController.login)

//get single users
router.route('/users').get(protect,authController.getUser)
//get all users
router.route('/all').get(authController.getAllusers)
module.exports=router;