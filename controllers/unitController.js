const db = require('../models/')
const Unit = db.units
const sequelize = db.sequelize
const asyncHandler = require('express-async-handler')
const { getPagination, getPagingData } = require('../utils/pagination')
const { Op } = require('sequelize')

// @desc Get All Units
// @route GET /units
// @access Private
const getAllUnits = asyncHandler(async (req, res) => {
  const { page, size, search, sortBy, sort } = req.query
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
        { unitName: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
        { abbreviation: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
        { description: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
      ],
    }
  }
  const { limit, offset } = getPagination(page, size)
  try {
    const units = await Unit.findAndCountAll({
      where: filterClause,
      order: OrderClause,
      limit,
      offset,
    })
    if (!units?.rows || !units?.rows?.length) {
      return res.json({
        rows: [],
        meta: { count: 0, totalPages: 0, currentPage: 0 },
      })
    } else {
      const response = getPagingData(units, page, limit)
      return res.json(response)
    }
  } catch (e) {
    console.log(e)
    return res
      .status(500)
      .json({ message: 'There was error while processing your request' })
  }
})

// @desc Get Unit by ID
// @route GET /units/:id
// @access Private

const getUnitById = asyncHandler(async (req, res) => {
  const id = req.params.id

  const unit = await Unit.findOne({ where: { id: id } })
  if (!unit) {
    return res.status(404).json('Unit not found')
  }

  return res.json(unit)
})

// @desc Create New Unit
// @route GET /units
// @access Private
const createNewUnit = asyncHandler(async (req, res) => {
  const { unitName, abbreviation, description } = req.body
  const unit = req.body
  if (!unitName || !abbreviation) {
    return res.status(400).json({ message: 'Invalid Unit Data Received' })
  }
  try {
    await Unit.create(unit)
    return res.json({ message: 'Unit created successfully.' })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'There was an error while adding a new unit.' })
  }
})

// @desc Update Unit
// @route GET /units/:id
// @access Private
const updateUnit = asyncHandler(async (req, res) => {
  const { id, unitName, abbreviation, description } = req.body
  try {
    await Unit.update(
      {
        unitName: unitName,
        abbreviation: abbreviation,
        description: description,
      },
      { where: { id: id } }
    )
    return res.json({ message: 'Unit updated Successfully!' })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: 'there was an error while updating unit' })
  }
})

// @desc Delete Unit
// @route GET /units
// @access Private
const deleteUnit = asyncHandler(async (req, res) => {})

module.exports = {
  getAllUnits,
  createNewUnit,
  updateUnit,
  deleteUnit,
  getUnitById,
}
