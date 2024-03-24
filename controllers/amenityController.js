const db = require('../models/')
const Amenity = db.amenities
const sequelize = db.sequelize
const asyncHandler = require('express-async-handler')

// @desc Get All Amenities
// @route GET /amenities
// @access Private
const getAllAmenities = asyncHandler(async (req, res) => {
  const amenities = await Amenity.findAll()

  return res.json(amenities)
})

// @desc Create New Amenity
// @route GET /amenities
// @access Private
const createNewAmenity = asyncHandler(async (req, res) => {})

// @desc Update Amenity
// @route GET /amenities
// @access Private
const updateAmenity = asyncHandler(async (req, res) => {})

// @desc Delete Amenity
// @route GET /amenities
// @access Private
const deleteAmenity = asyncHandler(async (req, res) => {})

module.exports = {
  getAllAmenities,
  createNewAmenity,
  updateAmenity,
  deleteAmenity,
}
