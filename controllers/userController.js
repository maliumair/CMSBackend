const crypto = require('crypto')
const db = require('../models/')
const User = db.users
const VerificationToken = db.verificationTokens
const sequelize = db.sequelize
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const { getPagination, getPagingData } = require('../utils/pagination')
const { addMinutes } = require('date-fns')
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require('../utils/emails')
const { Op } = require('sequelize')

// @desc Get All Users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const { page, size, search, sortBy, sort } = req.query
  console.log(sortBy, sort)
  let filterClause = {}
  let OrderClause = []
  if (sortBy) {
    if (sort === 'true') {
      OrderClause.push([`${sortBy}`, 'DESC'])
    } else {
      OrderClause.push([`${sortBy}`, 'ASC'])
    }
  }

  if (search) {
    filterClause = {
      [Op.or]: [
        { firstName: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
        { lastName: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
        { email: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
        { cnic: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
      ],
    }
  }
  const { limit, offset } = getPagination(page, size)
  try {
    const users = await User.findAndCountAll({
      where: filterClause,
      order: OrderClause,
      limit,
      offset,
      attributes: { exclude: ['password'] },
    })
    if (!users?.rows || !users?.rows?.length) {
      return res.json({
        rows: [],
        meta: { count: 0, totalPages: 0, currentPage: 0 },
      })
    } else {
      const response = getPagingData(users, page, limit)
      return res.json(response)
    }
  } catch (e) {
    console.log(e)
    return res
      .status(500)
      .json({ message: 'There was error while processing your request' })
  }
})

// @desc Create New User
// @Route POST /users
// @access Public
const createNewUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, cnic, role, password } = req.body
  let duplicateCNIC, duplicateEmail, duplicatePhone

  //confirm data
  if ((!firstName, !lastName, !email)) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Defining user object
  const user = {
    firstName,
    lastName,
    email,
  }

  //check for duplicates
  duplicateEmail = await User.findOne({ where: { email: email } })
  if (duplicateEmail) {
    return res.status(409).json({ message: 'Duplicate Email' })
  }

  if (cnic) {
    duplicateCNIC = await User.findOne({ where: { cnic: cnic } })
    if (duplicateCNIC) {
      return res.status(409).json({ message: 'Duplicate CNIC' })
    }
    user.cnic = cnic
  }

  if (phone) {
    duplicatePhone = await User.findOne({ where: { phone: phone } })
    if (duplicatePhone) {
      return res.status(409).json({ message: 'Duplicate Phone' })
    }
    user.phone = phone
  }

  // if role is defined, add to user object
  if (role && role === 'admin') {
    user.role = role
    user.isEmailVerified = false
    user.isApproved = false
  }

  // hash pwd and add to user object
  if (password) {
    let hashPwd = await bcrypt.hash(password, 10)
    user.password = hashPwd
  }

  //create and store new user
  try {
    const result = await User.create(user)
    const verificationToken = {
      token: crypto.randomBytes(64).toString('hex'),
      userId: result.id,
      type: 'Email Verification',
    }
    const result2 = await VerificationToken.create(verificationToken)
    if (result && result2) {
      await sendVerificationEmail(
        result.email,
        result.id,
        user.lastName,
        result2.token
      )

      res.status(201).json({ message: `New user with email: ${email} created` })
    } else {
      res.status(400).json({ message: 'Invalid User Data received' })
    }
  } catch (error) {
    res.status(400).json(error)
  }
})

// @desc Update User
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {})

// @desc Approve User
// @route PATCH /users/approve
// @access Private
const approveUser = asyncHandler(async (req, res) => {
  const { id } = req.body
  const user = await User.findOne({ where: { id: id } })
  if (!user) {
    return res.status(401).json({ message: 'User not found' })
  }

  await User.update({ isApproved: true }, { where: { id: id } })
  res.json({ message: 'User approved!' })
})

// @desc Activate / Deactivate User
// @route PATCH /users/active
// @access Private
const toggleActiveUser = asyncHandler(async (req, res) => {
  const { id } = req.body
  const user = await User.findOne({ where: { id: id } })
  if (!user) {
    return res.status(401).json({ message: 'User not found' })
  }

  await User.update({ isActive: !user.isActive }, { where: { id: id } })
  res.json({ message: 'User Activation Status Changed!' })
})
// @desc delete User
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {})

// @Desc ForgotPassword
// Route POST /users/forgot_password
// @access Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ where: { email: email } })
  if (!user) {
    return res.status(404).json({ message: 'Email not found' })
  }
  const verificationToken = {
    token: crypto.randomBytes(64).toString('hex'),
    userId: user.id,
    type: 'Password Reset',
  }
  const result = await VerificationToken.create(verificationToken)
  if (!result) {
    return res
      .status(400)
      .json({ message: 'There was an error while processing your request' })
  }

  await sendPasswordResetEmail(user.email, user.id, user.lastName, result.token)
  res.json({ message: 'We have sent you an email with a password reset link' })
})

const resetPassword = asyncHandler(async (req, res) => {
  const { uid, password, token } = req.body
  console.log(req.body)
  const user = await User.findByPk(uid)
  if (!user) {
    res.status(400).json({ message: 'User not Found' })
  }
  const verified = await VerificationToken.findOne({
    where: { userId: uid, token: token },
  })

  if (!verified || verified.type !== 'Password Reset') {
    res.status(400).json({ message: 'Invalid Password Reset Link.' })
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
  const hashed = await bcrypt.hash(password, 10)
  await User.update(
    {
      password: hashed,
    },
    { where: { id: uid } }
  )
  await VerificationToken.destroy({
    where: {
      token: token,
      userId: uid,
    },
  })

  res.json({ message: 'Password Reset Successfully' })
})

module.exports = {
  createNewUser,
  getAllUsers,
  updateUser,
  deleteUser,
  approveUser,
  toggleActiveUser,
  forgotPassword,
  resetPassword,
}
