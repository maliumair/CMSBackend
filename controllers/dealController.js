const db = require('../models/')
const { getPagination, getPagingData } = require('../utils/pagination')
const User = db.users
// const Deal = db.deals
const asyncHandler = require('express-async-handler')

// @desc Get All Users
// @route GET /users
// @access Private
const getAllDeals = asyncHandler(async (req, res) => {
  const { page, size, userId } = req.query
  var condition = userId ? { userId: userId } : null
  const { limit, offset } = getPagination(page, size)
})

// @desc Create New User
// @Route POST /deals
// @access private
const createNewDeal = asyncHandler(async (req, res) => {
  console.log(req.body)
})

// @desc Update User
// @route PATCH /deals
// @access Private
const updateDeal = asyncHandler(async (req, res) => {})

// @desc delete User
// @route DELETE /deals
// @access Private
const deleteDeal = asyncHandler(async (req, res) => {})

module.exports = {
  createNewDeal,
  getAllDeals,
  updateDeal,
  deleteDeal,
}
