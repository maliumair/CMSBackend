const db = require('../models/')
const User = db.users
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get All Users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll()
  if (!users || !users.length) {
    return res.status(400).json({ message: 'No users found' })
  }
  return res.json(users)
})

// @desc Create New User
// @Route POST /users
// @access Public
const createNewUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, cnic, role, password } = req.body

  //confirm data
  if ((!cnic || !firstName, !lastName, !email || !phone)) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  //check for duplicates
  const duplicateCNIC = await User.findOne({ where: { cnic: cnic } })
  const duplicateEmail = await User.findOne({ where: { email: email } })
  const duplicatePhone = await User.findOne({ where: { phone: phone } })

  if (duplicateCNIC) {
    return res.status(409).json({ message: 'Duplicate CNIC' })
  }
  if (duplicateEmail) {
    return res.status(409).json({ message: 'Duplicate Email' })
  }
  if (duplicatePhone) {
    return res.status(409).json({ message: 'Duplicate Phone' })
  }

  // hash pwd

  const user = {
    cnic,
    firstName,
    lastName,
    email,
    phone,
  }

  if (role && role === 'admin') {
    user.role = role
  }

  if (password) {
    let hashPwd = await bcrypt.hash(password, 10)
    user.password = hashPwd
  }

  //create and store new user
  try {
    const result = await User.create(user)
    if (result) {
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

// @desc delete User
// @route DELETE /users
// @access Private

const deleteUser = asyncHandler(async (req, res) => {})

module.exports = {
  createNewUser,
  getAllUsers,
  updateUser,
  deleteUser,
}
