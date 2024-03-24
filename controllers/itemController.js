const db = require('../models/')
const Unit = db.units
const Item = db.items
const Amenity = db.amenities
const ItemAmenity = db.itemAmenities
const sequelize = db.sequelize
const asyncHandler = require('express-async-handler')
const { getPagination, getPagingData } = require('../utils/pagination')
const { Op } = require('sequelize')

// @desc Get All Items
// @route GET /items
// @access Private
const getAllItems = asyncHandler(async (req, res) => {
  const { page, size, search, sortBy, sort } = req.query
  console.log(page, size, search, sortBy, sort)
  const { limit, offset } = getPagination(page, size)
  let filterSearch = {}
  let orderClause = []

  if (search) {
    filterSearch = {
      [Op.or]: [
        { itemType: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
        { itemName: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
        { description: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
        { area: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
        { quantity: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
        { unitPrice: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
        { totalPrice: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
      ],
    }
  }

  if (sortBy) {
    if (sort === 'true') {
      orderClause.push([`${sortBy}`, 'DESC'])
    } else {
      orderClause.push([`${sortBy}`, 'ASC'])
    }
  }

  try {
    const items = await Item.findAndCountAll({
      where: filterSearch,
      order: orderClause,
      limit,
      offset,
      distinct: true,
      col: Item.id,
      include: [
        {
          model: Amenity,
          required: true,
        },

        {
          model: Unit,
          required: true,
        },
      ],
    })
    if (!items?.rows || !items?.rows?.length) {
      return res.json({
        rows: [],
        meta: { count: 0, totalPages: 0, currentPage: 0 },
      })
    } else {
      const response = getPagingData(items, page, limit)
      return res.json(response)
    }
  } catch (e) {
    console.log(e)
  }
})

// @desc Get Unit by ID
// @route GET /units/:id
// @access Private

const getItemById = asyncHandler(async (req, res) => {
  const id = req.params.id

  const item = await Item.findOne({
    where: { id: id },
    include: [
      {
        model: Amenity,
        required: true,
      },
      {
        model: Unit,
        required: true,
      },
    ],
  })
  if (!item) {
    return res.status(404).json('Item not found')
  }

  return res.json(item)
})

// @desc Create New Item
// @route GET /items
// @access Private
const createNewItem = asyncHandler(async (req, res) => {
  const {
    itemType,
    itemName,
    unitId,
    unitPrice,
    totalPrice,
    area,
    location,
    address,
    view,
    amenities,
    description,
    floor,
    bedrooms,
  } = req.body

  if (!itemType || !itemName || !unitId || !unitPrice || !totalPrice) {
    return res.status(400).json({ message: 'Invalid item data' })
  }

  let itemData = {
    itemType,
    itemName,
    area,
    unitId,
    unitPrice,
    totalPrice,
    location,
    view,
    description,
    bedrooms,
    floor,
    address,
    lat: location.lat,
    lng: location.lng,
  }

  try {
    await sequelize.transaction(async (t) => {
      const item = await Item.create(
        {
          ...itemData,
        },
        { transaction: t }
      )
      for (let i = 0; i < amenities.length; i++) {
        await ItemAmenity.create(
          {
            amenityId: amenities[i],
            itemId: item.id,
          },
          { transaction: t }
        )
      }
    })
    return res.json({ message: 'Item created successfully!' })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: 'There was an error while adding a new item.' })
  }
})

// @desc Update Item
// @route GET /items
// @access Private
const updateItem = asyncHandler(async (req, res) => {
  const {
    id,
    itemType,
    itemName,
    unitId,
    unitPrice,
    totalPrice,
    area,
    address,
    location,
    view,
    amenities,
    description,
    floor,
    bedrooms,
  } = req.body

  if (!itemType || !itemName || !unitId || !unitPrice || !totalPrice) {
    return res.status(400).json({ message: 'Invalid item data' })
  }

  let itemData = {
    itemType,
    itemName,
    area,
    unitId,
    unitPrice,
    totalPrice,
    address,
    lat: location.lat,
    lng: location.lng,
    view,
    description,
    bedrooms,
    floor,
  }

  try {
    await sequelize.transaction(async (t) => {
      const item = await Item.update(
        {
          ...itemData,
        },
        {
          where: { id: id },
        },

        { transaction: t }
      )

      await ItemAmenity.destroy({ where: { itemId: id } }, { transaction: t })
      for (let i = 0; i < amenities.length; i++) {
        await ItemAmenity.create(
          {
            amenityId: amenities[i],
            itemId: id,
          },
          { transaction: t }
        )
      }
    })
    return res.json({ message: 'Item updated successfully!' })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: 'There was an error while updating item.' })
  }
})

// @desc Delete Item
// @route GET /items
// @access Private
const deleteItem = asyncHandler(async (req, res) => {})

module.exports = {
  getAllItems,
  createNewItem,
  updateItem,
  deleteItem,
  getItemById,
}
