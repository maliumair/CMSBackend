const db = require('../models/')
const { getPagination, getPagingData } = require('../utils/pagination')
const User = db.users
const Deal = db.deals
const Item = db.items
const Unit = db.units
const sequelize = db.sequelize
const Installment = db.installments
const DealDocument = db.dealDocuments
const Address = db.addresses
const Nominee = db.nominees
const { Op, col } = require('sequelize')
const { deleteObject } = require('../utils/deleteObject')

// const Deal = db.deals
const asyncHandler = require('express-async-handler')
const { sendDealCreationEmail } = require('../utils/emails')
const { generatePDF } = require('../utils/generateDealPdf')

// @desc Get All Deals
// @route GET /deals
// @access Private
const getAllDeals = asyncHandler(async (req, res) => {
  const { page, size, email, search, sortBy, sort, type } = req.query
  console.log(search)
  const { limit, offset } = getPagination(page, size)
  let filterEmail = {}
  let filterClause = []
  let orderClause = []
  if (email) {
    filterEmail = { email: email }
  }

  if (search) {
    filterClause.push({
      [Op.or]: [
        { dealType: { [Op.regexp]: sequelize.literal(`'${search}'`) } },
      ],
    })
  }

  if (type != '') {
    filterClause.push({
      dealType: type,
    })
  }

  if (sortBy) {
    if (sort === 'true') {
      orderClause.push([col(`${sortBy}`), 'DESC'])
    } else {
      orderClause.push([col(`${sortBy}`), 'ASC'])
    }
  }

  try {
    const deals = await Deal.findAndCountAll({
      where: filterClause,
      limit,
      offset,
      distinct: true,
      col: Deal.id,
      include: [
        {
          model: User,
          required: true,
          where: filterEmail,
          include: [
            {
              model: Address,
              required: true,
            },
            {
              model: Nominee,
              required: true,
            },
          ],
        },
        {
          model: Installment,
          required: true,
        },
        {
          model: DealDocument,
        },
        {
          model: Item,
          required: true,
          include: [
            {
              model: Unit,
              required: true,
            },
          ],
        },
      ],
      order: orderClause,
    })
    if (!deals?.rows || !deals?.rows?.length) {
      return res.json({
        rows: [],
        meta: { count: 0, totalPages: 0, currentPage: 0 },
      })
    } else {
      const response = getPagingData(deals, page, limit)
      return res.json(response)
    }
  } catch (e) {
    console.log(e)
  }
})

// @desc Get deal by Id
// @Route POST /deals/:id
// @access private

const getDealById = asyncHandler(async (req, res) => {
  const id = req.params.id
  const filter = req.query.filter
  let filterClause = {}
  console.log(filter)
  if (filter) {
    filterClause = { email: filter }
  }
  const deal = await Deal.findOne({
    where: { id: id },
    include: [
      {
        model: User,
        required: true,
        where: filterClause,
        include: [
          {
            model: Address,
            required: true,
          },
          {
            model: Nominee,
            required: true,
          },
        ],
      },
      {
        model: Item,
        required: true,
        include: [
          {
            model: Unit,
            required: true,
          },
        ],
      },
      {
        model: Installment,
        required: true,
      },
      {
        model: DealDocument,
      },
    ],
  })

  if (!deal) {
    return res.status(404).json('Deal not found')
  }

  return res.json(deal)
})

// @desc Create New Deal
// @Route POST /deals
// @access private
const createNewDeal = asyncHandler(async (req, res) => {
  let id = null
  const dealData = req.body
  const {
    user,
    nominee,
    addresses,
    capital,
    booking,
    rental,
    product,
    installments,
    dealType,
  } = dealData

  duplicateEmail = await User.findOne({ where: { email: user.email } })
  duplicateCNIC = await User.findOne({ where: { cnic: user.cnic } })
  duplicatePhone = await User.findOne({ where: { phone: user.phone } })

  if (duplicateCNIC) {
    return res.status(409).json({ message: 'Duplicate CNIC' })
  }
  if (duplicateEmail) {
    return res.status(409).json({ message: 'Duplicate Email' })
  }
  if (duplicatePhone) {
    return res.status(409).json({ message: 'Duplicate Phone' })
  }

  //Deal
  const { itemId } = product
  const {
    commissionPercentage,
    commissionPerUnit,
    commissionFixed,
    totalCommission,
  } = capital.commission

  const { discountPercentage, discountFixed, totalDiscount } = capital.discount
  const { plan, planDuration, bookingRental } = booking
  const { total, fixed, percentage } = rental
  try {
    await sequelize.transaction(async (t) => {
      //New User
      if (dealType === 'Negotiated') {
        user.isActive = 0
      }
      const userRow = await User.create(user, { transaction: t })
      //New Nominee
      const nomineeRow = await Nominee.create(nominee, { transaction: t })
      //Addresses
      const permanent = await Address.create(
        {
          ...addresses.permanent,
          type: 'Permanent',
        },
        { transaction: t }
      )
      const mailing = await Address.create(
        {
          ...addresses.mailing,
          type: 'Mailing',
        },
        { transaction: t }
      )

      const dealData = {
        dealType,
        itemId,
        commissionPercentage,
        commissionPerUnit,
        commissionFixed,
        totalCommission,
        discountPercentage,
        discountFixed,
        totalDiscount,
        plan: plan,
        duration: planDuration,
      }
      if (dealType === 'Negotiated') {
        dealData.offeredPrice = product.offeredTotalPrice
      }
      // deal
      const dealRow = await Deal.create(dealData, { transaction: t })
      if (plan === 'Lump Sum' && bookingRental) {
        Deal.update(
          {
            rentPercentage: percentage,
            rentFixed: fixed,
            rentTotal: total,
          },
          { where: { id: dealRow.id } },
          { transaction: t }
        )
      }

      // Updating Item Status
      if (dealType !== 'Negotiated') {
        Item.update(
          { status: 'Sold' },
          { where: { id: itemId } },
          { transaction: t }
        )
      }

      //installments
      let installmentArray = []
      for (let i = 0; i < installments.length; i++) {
        if (dealType === 'Negotiated' && i === 0) {
          let installmentRow = await Installment.create(
            {
              installmentType: installments[i].type,
              installmentPercentage: installments[i].percentage,
              installmentFixed: installments[i].fixed,
              installmentAmount: installments[i].amount,
              installmentAmountPaid: 0,
              installmentDueOn: new Date(installments[i].unformattedDate),
              isPaid: false,
              installmentPaidOn: installments[i].paidOn,
            },
            { transaction: t }
          )
          installmentArray.push(installmentRow)
        } else {
          let installmentRow = await Installment.create(
            {
              installmentType: installments[i].type,
              installmentPercentage: installments[i].percentage,
              installmentFixed: installments[i].fixed,
              installmentAmount: installments[i].amount,
              installmentAmountPaid: installments[i].paid,
              installmentDueOn: new Date(installments[i].unformattedDate),
              isPaid: installments[i].isPaid,
              installmentPaidOn: installments[i].paidOn,
            },
            { transaction: t }
          )

          installmentArray.push(installmentRow)
        }
      }
      //Adding foreign references
      await userRow.setNominee(nomineeRow, { transaction: t })
      await userRow.addAddresses([permanent, mailing], { transaction: t })
      await userRow.addDeals([dealRow], { transaction: t })
      await dealRow.addInstallments(installmentArray, { transaction: t })

      //Saving Id param
      id = dealRow.id

      //Generating PDF and Sending Email
      // await generatePDF(userRow, dealRow, installments)
      sendDealCreationEmail(userRow, dealRow, installments)
    })

    res.json({ message: 'Deal Creation Successful', id: id })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: `There was an error while creating the deal.`,
    })
  }
})

// @desc Update Deal Documents
// @route PATCH /deals/documents
// @access Private
const updateDealDocuments = asyncHandler(async (req, res) => {
  const { id, imageCaption } = req.body
  const images = req.files
  console.log(images)

  for (let i = 0; i < images.length; i++) {
    try {
      await DealDocument.create({
        imageLink: images[i].location,
        imageCaption: imageCaption,
        etag: images[i].etag,
        dealId: id,
      })
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        message: 'There was an error while uploading image. Try again!',
      })
    }
  }

  return res.json({ message: 'Images Uploaded' })
})

// @desc Update Deal
// @route PATCH /deals/documents
// @access Private

const deleteDealDocuments = asyncHandler(async (req, res) => {
  const { id } = req.body
  const document = await DealDocument.findOne({ where: { id: id }, raw: true })
  let linkSplit = document.imageLink.split('/')
  const key = linkSplit[linkSplit.length - 1]
  try {
    await deleteObject(key)
    await DealDocument.destroy({ where: { id: id } })
  } catch (err) {
    console.log(err)
  }
  return res.json({ message: 'Document Deleted' })
})

// @desc Update Deal
// @route PATCH /deals
// @access Private
const updateDeal = asyncHandler(async (req, res) => {})

// @desc delete Deal
// @route DELETE /deals
// @access Private
const deleteDeal = asyncHandler(async (req, res) => {})

module.exports = {
  createNewDeal,
  getAllDeals,
  updateDeal,
  deleteDeal,
  getDealById,
  updateDealDocuments,
  deleteDealDocuments,
}
