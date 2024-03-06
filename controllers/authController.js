const db = require('../models')
const User = db.users
const VerificationToken = db.verificationTokens
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
    return res.status(401).json({ message: 'Invalid Password' })
  }

  if (!foundUser.isEmailVerified) {
    return res.status(401).json({ message: 'Email address is not verified.' })
  }

  if (!foundUser.isApproved) {
    return res.status(401).json({
      message: 'Your account is pending Approval. Please try again later',
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

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    partitioned: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  res.json({ accessToken })
})

// @desc Refresh
// @Route POST /auth/refresh
// @access Public
const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

  const refreshToken = cookies.jwt

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
  const cookies = req.cookies
  if (!cookies?.jwt) return res.status(204)

  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  })

  res.json({ message: 'Cookie cleared' })
})

// @desc Email Verification
// @Route POST /auth/verify_email
// @access Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token, uid } = req.body
  const user = await User.findOne({ where: { id: uid } })
  const verified = await VerificationToken.findOne({
    where: { token: token, userId: uid },
  })
  if (user.isEmailVerified) {
    return res.json({ message: 'Email verification Successful' })
  }

  if (!verified) {
    return res
      .status(401)
      .json({ message: 'Invalid Verification Token. Please try again!' })
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

module.exports = {
  login,
  refresh,
  logout,
  verifyEmail,
}
