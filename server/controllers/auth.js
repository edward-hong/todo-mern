const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail')

const User = require('../models/user')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.signup = (req, res) => {
  const { name, email, password } = req.body

  User.findOne({ email }).then(foundUser => {
    if (foundUser) {
      return res.status(400).json({
        error: 'Email is taken',
      })
    } else {
      const token = jwt.sign(
        { name, email, password },
        process.env.JWT_ACCOUNT_ACTIVATION,
        { expiresIn: '10m' }
      )

      console.log(token)

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Account activation link',
        html: `
          <h1>Please use the following link to activate your account</h1>
          <p>${process.env.CLIENT_URL}/activate/${token}</p>
          <hr />
          <p>This email may contain sensitive information</p>
          <p>${process.env.CLIENT_URL}</p>
        `,
      }

      sgMail
        .send(emailData)
        .then(_sent => {
          return res.json({
            message: `Email has been sent to ${email}. Follow the instructions to activate your account.`,
          })
        })
        .catch(err => {
          console.log('SIGNUP EMAIL SENT ERROR', err.body.errors)
          return res.json({
            message: err.message,
          })
        })
    }
  })
}

exports.accountActivation = (req, res) => {
  const { token } = req.body

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, _decoded) {
        if (err) {
          console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err)
          return res.status(401).json({
            error: 'Expired link. Signup again',
          })
        }

        const { name, email, password } = jwt.decode(token)

        const newUser = new User({ name, email, password })

        newUser
          .save()
          .then(() => {
            return res.json({
              message: 'Signup success. Please signin',
            })
          })
          .catch(err => {
            if (err) {
              console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err)
              return res.status(401).json({
                error: 'Error saving user in database. Try signup again',
              })
            }
          })
      }
    )
  } else {
    return res.json({
      message: 'Something went wrong. Try again.',
    })
  }
}

exports.signin = (req, res) => {
  const { email, password } = req.body

  User.findOne({ email })
    .then(foundUser => {
      if (!foundUser) {
        return res.status(400).json({
          error: 'User with that email does not exist. Please signup',
        })
      }

      // authenticate
      if (!foundUser.authenticate(password)) {
        return res.status(400).json({
          error: 'Email and password do not match',
        })
      }

      // generate a token and send to client
      const token = jwt.sign({ _id: foundUser._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      })
      const { _id, name, email, role } = foundUser

      return res.json({
        token,
        user: { _id, name, email, role },
      })
    })
    .catch(err => {
      console.log('SIGNIN USER ERROR', err)
      return res.json({
        error: 'User with that email does not exist. Please signup',
      })
    })
}

exports.forgotPassword = (req, res) => {
  const { email } = req.body

  User.findOne({ email })
    .then(foundUser => {
      if (!foundUser) {
        return res.status(400).json({
          error: 'User with that email does not exist',
        })
      } else {
        const token = jwt.sign(
          { _id: foundUser._id },
          process.env.JWT_RESET_PASSWORD,
          { expiresIn: '10m' }
        )

        const emailData = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: 'Password Reset Link',
          html: `
            <h1>Please use the following link to reset your password</h1>
            <p>${process.env.CLIENT_URL}/reset/${token}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            <p>${process.env.CLIENT_URL}</p>
          `,
        }

        return foundUser
          .updateOne({ resetPasswordLink: token })
          .then(() => {
            sgMail
              .send(emailData)
              .then(sent => {
                return res.json({
                  message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
                })
              })
              .catch(err => {
                console.log('SIGNUP EMAIL SENT ERROR', err)
                return res.json({
                  message: err.message,
                })
              })
          })
          .catch(() => {
            return res.status(400).json({
              error:
                'Database connection error on user password forgot request',
            })
          })
      }
    })
    .catch(_err => {
      return res.status(400).json({
        error: 'User with that email does not exist',
      })
    })
}

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body

  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      (err, _decoded) => {
        if (err) {
          return res.status(400).json({
            error: 'Expired link. Try again',
          })
        }

        User.findOne({ resetPasswordLink })
          .then(foundUser => {
            if (!foundUser) {
              return res.status(400).json({
                error: 'Could not find user with reset password link',
              })
            }

            foundUser.password = newPassword
            foundUser.resetPasswordLink = ''

            foundUser
              .save()
              .then(_result => {
                res.json({
                  message: 'Great! Now you can login with your new password',
                })
              })
              .catch(_err => {
                res.status(400).json({ error: 'Error resetting user password' })
              })
          })
          .catch(_err => {
            return res.status(400).json({
              error: 'Something went wrong. Try later',
            })
          })
      }
    )
  }
}
