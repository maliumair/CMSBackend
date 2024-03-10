const db = require('../models/')
const { getPagination, getPagingData } = require('../utils/pagination')
const User = db.users
const Deal = db.deals
const sequelize = db.sequelize
const Installment = db.installments
const Address = db.addresses
const Nominee = db.nominees
// const Deal = db.deals
const asyncHandler = require('express-async-handler')

// @desc Get All Deals
// @route GET /deals
// @access Private
const getAllDeals = asyncHandler(async (req, res) => {
  const { page, size, filter } = req.query
  const { limit, offset } = getPagination(page, size)
  let filterClause = {}
  console.log(filter)
  if (filter) {
    filterClause = { email: filter }
  }
  console.log(filterClause)
  const deals = await Deal.findAndCountAll({
    limit,
    offset,
    distinct: true,
    col: Deal.id,
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
        model: Installment,
        required: true,
      },
    ],
  })
  if (!deals?.rows || !deals?.rows?.length) {
    return res.status(400).json({ message: 'No deals found' })
  } else {
    const response = getPagingData(deals, page, limit)
    return res.json(response)
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
  console.log(filterClause)
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
        model: Installment,
        required: true,
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
  //   console.log(req.body)
  const dealData = req.body
  const {
    user,
    nominee,
    addresses,
    capital,
    booking,
    balloon,
    confirmation,
    lumpSum,
    terminal,
    rental,
    product,
    installments,
  } = dealData

  // Writing new save function to include lump sum scenario.
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
  const { type, unit, totalArea, unitPrice, totalPrice } = product
  const { commissionPercentage, commissionFixed, totalCommission } =
    capital.commission
  const { discountPercentage, discountFixed, totalDiscount } = capital.discount
  const { plan, planDuration, bookingRental } = booking
  const { total, fixed, percentage } = rental

  try {
    await sequelize.transaction(async (t) => {
      // New User
      const userRow = await User.create(user, { transaction: t })
      // New Nominee
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
      const dealRow = await Deal.create(
        {
          productType: type,
          measuringUnit: unit,
          totalArea,
          unitPrice,
          totalPrice,
          commissionPercentage,
          commissionFixed,
          totalCommission,
          discountPercentage,
          discountFixed,
          totalDiscount,
          dealType: plan,
          duration: planDuration,
        },
        { transaction: t }
      )
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
      let installmentArray = []
      for (let i = 0; i < installments.length; i++) {
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
      //Adding foreign references
      await userRow.setNominee(nomineeRow, { transaction: t })
      await userRow.addAddresses([permanent, mailing], { transaction: t })
      await userRow.addDeals([dealRow], { transaction: t })
      await dealRow.addInstallments(installmentArray, { transaction: t })
    })

    res.json({ message: 'Deal Creation Successful' })
  } catch (err) {
    res.status(400).json({
      message: `There was an error while creating the deal.`,
    })
  }
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
}
