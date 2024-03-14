const db = require('../models')
const User = db.users
const VerificationToken = db.verificationTokens
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { addMinutes } = require('date-fns')
const { sendVerificationEmail } = require('../utils/emails')
const asyncHandler = require('express-async-handler')

// @desc Login
// @Route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const foundUser = await User.findOne({ where: { email: email } })
  // can also check for foundUser.active here -- active field not available in CMS project
  if (!foundUser) {
    return res.status(401).json({ message: 'Email is not registered!' })
  }

  const match = await bcrypt.compare(password, foundUser.password)

  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  if (!foundUser.isEmailVerified) {
    return res.status(401).json({ message: 'Email address is not verified.' })
  }

  if (!foundUser.isApproved) {
    return res.status(401).json({
      message: 'Your account is pending Approval. Please try again later',
    })
  }
  if (!foundUser.isActive) {
    return res.status(401).json({
      message: 'Your account has been de-activated!',
    })
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: foundUser.email,
        role: foundUser.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  )

  const refreshToken = jwt.sign(
    { email: foundUser.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  )

  res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

// @desc Refresh
// @Route POST /auth/refresh
// @access Public
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' })

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' })

      const foundUser = await User.findOne({ where: { email: decoded.email } })

      if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
            role: foundUser.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      )

      res.json({ accessToken })
    })
  )
})

// @desc Logout
// @Route POST /auth/logout
// @access Public
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(204)
  res.json({ message: 'Token Cleared' })
})

// @desc Email Verification
// @Route POST /auth/verify_email
// @access Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token, uid } = req.body
  const user = await User.findOne({ where: { id: uid } })
  if (!user) {
    return res.status(400).json({ message: 'User does not exist' })
  }
  const verified = await VerificationToken.findOne({
    where: { token: token, userId: uid },
  })
  if (user.isEmailVerified) {
    return res.json({ message: 'Email verification Successful' })
  }

  if (!verified || verified.type !== 'Email Verification') {
    return res.status(401).json({
      message:
        'Invalid Verification Token. Please request a new one to continue!',
    })
  }

  if (addMinutes(verified.createdAt, 10) < new Date()) {
    await VerificationToken.destroy({
      where: {
        token: token,
        userId: uid,
      },
    })
    return res
      .status(401)
      .json({ message: 'Your verification link has expired' })
  }
  await User.update(
    { isEmailVerified: true },
    {
      where: {
        id: uid,
      },
    }
  )
  await VerificationToken.destroy({
    where: {
      token: token,
      userId: uid,
    },
  })
  return res.json({ message: 'Email verification Successful!' })
})

const resendVerificationLink = asyncHandler(async (req, res) => {
  const { id } = req.body
  const user = await User.findByPk(id)
  if (!user) {
    return res.status(400).json({ message: 'User does not exist' })
  }
  try {
    const verificationToken = {
      token: crypto.randomBytes(64).toString('hex'),
      userId: user.id,
      type: 'Email Verification',
    }
    const result = await VerificationToken.create(verificationToken)
    console.log(user.email)
    if (result) {
      await sendVerificationEmail(
        user.email,
        user.id,
        user.lastName,
        result.token
      )

      res.status(201).json({ message: `New Verification Link Sent` })
    } else {
      res.status(400).json({ message: 'Invalid Data received' })
    }
  } catch (error) {
    res.status(400).json(error)
  }
})

module.exports = {
  login,
  refresh,
  logout,
  verifyEmail,
  resendVerificationLink,
}
