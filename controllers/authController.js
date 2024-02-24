const db = require('../models')
const user = db.users
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

  const foundUser = await user.findOne({ where: { email: email } })
  // can also check for foundUser.active here -- active field not available in CMS project
  if (!foundUser) {
    return res.status(401).json({ message: 'Email is not registered!' })
  }

  const match = await bcrypt.compare(password, foundUser.password)

  if (!match) {
    return res.status(401).json({ message: 'Invalid Password' })
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: foundUser.email,
        role: foundUser.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '2m' }
  )

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '3m' }
  )

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  res.json({ accessToken })
})

// @desc Refresh
// @Route POST /auth/refresh
// @access Public
const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies
  console.log(cookies)
  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

  const refreshToken = cookies.jwt

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' })

      const foundUser = await user.findOne({ where: { email: decoded.email } })

      if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
            role: foundUser.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '2m' }
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
  if (!cookies?.jwt) return res.sendStatus(204)

  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  })

  res.json({ message: 'Cookie cleared' })
})

module.exports = {
  login,
  refresh,
  logout,
}
