const express = require('express')
const router = express.Router()

const {
  signup,
  signin,
  accountActivation,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth')
const {
  userSignupValidator,
  userSigninValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/auth')
const { runValidation } = require('../validators')

router.post('/signup', userSignupValidator, runValidation, signup)
router.post('/activation', accountActivation)
router.post('/signin', userSigninValidator, runValidation, signin)
router.put(
  '/forgot-password',
  forgotPasswordValidator,
  runValidation,
  forgotPassword
)
router.put(
  '/reset-password',
  resetPasswordValidator,
  runValidation,
  resetPassword
)

module.exports = router
