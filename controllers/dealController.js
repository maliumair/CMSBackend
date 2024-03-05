const db = require('../models/')
const { getPagination, getPagingData } = require('../utils/pagination')
const User = db.users
const Deal = db.deals
const Installment = db.installments
const Address = db.addresses
const Nominee = db.nominees
// const Deal = db.deals
const asyncHandler = require('express-async-handler')

// @desc Get All Deals
// @route GET /deals
// @access Private
const getAllDeals = asyncHandler(async (req, res) => {
  const { page, size, userId } = req.query
  var condition = userId ? { userId: userId } : null
  const { limit, offset } = getPagination(page, size)
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
  console.log(installments)

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

  // New User
  const userRow = await User.create(user)

  // New Nominee
  const nomineeRow = await Nominee.create(nominee)

  //Addresses
  const permanent = await Address.create({
    ...addresses.permanent,
    type: 'Permanent',
  })
  const mailing = await Address.create({
    ...addresses.mailing,
    type: 'Mailing',
  })

  //Deal
  const { type, unit, totalArea, unitPrice, totalPrice } = product
  const { commissionPercentage, commissionFixed, totalCommission } =
    capital.commission
  const { discountPercentage, discountFixed, totalDiscount } = capital.discount
  const { plan, planDuration, bookingRental } = booking
  const { total, fixed, percentage } = rental

  const dealRow = await Deal.create({
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
  })

  if (plan === 'Lump Sum' && bookingRental) {
    Deal.update(
      {
        rentPercentage: percentage,
        rentFixed: fixed,
        rentTotal: total,
      },
      { where: { id: dealRow.id } }
    )
  }

  let installmentArray = []
  for (let i = 0; i < installments.length; i++) {
    console.log(new Date(installments[i].unformattedDate))
    let installmentRow = await Installment.create({
      installmentType: installments[i].type,
      installmentPercentage: installments[i].percentage,
      installmentFixed: installments[i].fixed,
      installmentAmount: installments[i].amount,
      installmentAmountPaid: installments[i].paid,
      installmentDueOn: new Date(installments[i].unformattedDate),
      isPaid: installments[i].isPaid,
    })

    installmentArray.push(installmentRow)
  }

  //Adding foreign references
  await userRow.setNominee(nomineeRow)
  await userRow.addAddresses([permanent, mailing])
  await userRow.addDeals([dealRow])
  await dealRow.addInstallments(installmentArray)
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
}
