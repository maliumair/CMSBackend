const db = require('../models/')
const Unit = db.units
const Item = db.items
const Deal = db.deals
const Installment = db.installments
const User = db.users
const Amenity = db.amenities
const ItemAmenity = db.itemAmenities
const Document = db.dealDocuments
const sequelize = db.sequelize
const asyncHandler = require('express-async-handler')
const { getPagination, getPagingData } = require('../utils/pagination')
const { Op } = require('sequelize')

// @desc Get All Items
// @route GET /items
// @access Private
const getAllItems = asyncHandler(async (req, res) => {
  const { page, size, search, sortBy, sort, status } = req.query
  const { limit, offset } = getPagination(page, size)
  let filterClause = []
  let orderClause = []

  if (search) {
    filterClause.push({
      [Op.or]: [
        { itemType: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
        { itemName: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
        { description: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
        { area: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
        { quantity: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
        { unitPrice: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
        { totalPrice: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
      ],
    })
  }

  if (status) {
    filterClause.push({
      status: status,
    })
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
      where: filterClause,
      order: orderClause,
      limit,
      offset,
      distinct: true,
      col: Item.id,
      include: [
        {
          model: Amenity,
        },

        {
          model: Unit,
          required: true,
        },
        {
          model: Document,
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
      },
      {
        model: Unit,
        required: true,
      },
      {
        model: Document,
      },
      {
        model: Deal,
        include: [{ model: User }, { model: Installment }],
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
    images,
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
      for (let i = 0; i < images.length; i++) {
        await Document.create(
          {
            imageLink: images[i].imageLink,
            imageCaption: images[i].imageCaption,
            imageHash: images[i].imageHash,
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
    images,
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

      await Document.destroy({ where: { itemId: id } }, { transaction: t })

      for (let i = 0; i < images.length; i++) {
        await Document.create(
          {
            imageLink: images[i].imageLink,
            imageCaption: images[i].imageCaption,
            imageHash: images[i].imageHash,
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
