const numberFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'PKR',
})

let installmentsArray = []
const dealMail = (user, deal, installments) => {
  const name = `<div style="margin-right: 20px;"><p style="margin: 0;"><strong style="color : #0e1a4e;">Name:</strong> ${
    user.dataValues.firstName + ' ' + user.dataValues.lastName
  }</p></div>`
  const cnic = `<div style="margin-right: 20px;"><p style="margin: 0;"><strong style="color : #0e1a4e;">CNIC:</strong> ${user.dataValues.cnic}</p></div>`
  const relation = `<div style="margin-right: 20px;"><p style="margin: 0;"><strong style="color : #0e1a4e;">${user.dataValues.relation}:</strong> ${user.dataValues.relationName}</p></div>`
  const email = `<div style="margin-right: 20px;"><p style="margin: 0;"><strong style="color : #0e1a4e;">Email:</strong> ${user.dataValues.email}</p></div>`
  const phone = `<div style="margin-right: 20px;"><p style="margin: 0;"><strong style="color : #0e1a4e;">Phone:</strong> ${user.dataValues.phone}</p></div>`
  const password = `<div style="margin-right: 20px;"><p style="margin: 0;"><strong style="color : #0e1a4e;">Password:</strong> CM$12345</p></div>`

  const productType = `<div style="margin-right: 20px;"><p style="margin: 0;"><strong style="color : #0e1a4e;">Product:</strong> ${deal.dataValues.productType}</p></div>`
  const totalArea = `<div style="margin-right: 20px;"><p style="margin: 0;"><strong style="color : #0e1a4e;">Total Area:</strong> ${
    deal.dataValues.totalArea + '' + deal.dataValues.measuringUnit
  }</p></div>`
  const unitPrice = `<div style="margin-right: 20px;"><p style="margin: 0;"><strong style="color : #0e1a4e;">Unit Price:</strong> ${numberFormat.format(
    deal.dataValues.unitPrice
  )}</p></div>`
  const totalPrice = `<div style="margin-right: 20px;"><p style="margin: 0;"><strong style="color : #0e1a4e;">Total Price:</strong> ${numberFormat.format(
    deal.dataValues.totalPrice
  )}</p></div>`
  const commission = `<div style="margin-right: 20px;"><p style="margin: 0;"><strong style="color : #0e1a4e;">Commission:</strong> ${numberFormat.format(
    deal.dataValues.totalCommission
  )}</p></div>`
  const discount = `<div style="margin-right: 20px;"><p style="margin: 0;"><strong style="color : #0e1a4e;">Discount:</strong> ${numberFormat.format(
    deal.dataValues.totalDiscount
  )}</p></div>`
  const dealType = `<div style="margin-right: 20px;"><p style="margin: 0;"><strong style="color : #0e1a4e;">Deal Type:</strong> ${deal.dataValues.dealType}</p></div>`
  const duration = `<div style="margin-right: 20px;"><p style="margin: 0;"><strong style="color : #0e1a4e;">Duration:</strong> ${deal.dataValues.duration}</p></div>`

  for (let i = 0; i < installments.length; i++) {
    installmentsArray.push(
      `<tr>
                                            <td style="padding: 10px;">${
                                              installments[i].month
                                            }</td>
                                            <td style="padding: 10px;">${
                                              installments[i].type
                                            }</td>
                                            <td style="padding: 10px;">${numberFormat.format(
                                              installments[i].amount
                                            )}</td>
                                            <td style="padding: 10px;">${
                                              installments[i].date
                                            }</td>
                                        </tr>`
    )
  }

  return `
   <body
    style="
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      line-height: 1.6;
    "
  >
  <div
      style="
        max-width: 600px;
        margin: auto;
        background: #f4f4f4;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      "
    >
      <div
        style="
          text-align: center;
          background: #0e1a4e;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          width: 100%;
          padding: 10px;
        "
      >
      <div style="display:inline; margin:auto;">
      <img
          src="cid:logo"
          alt="Logo"
          style="
            width: 35px;
            height: 35px;
            border-radius: 50%;
            border: 3px solid #ffffff;
          "
        />
      </div>
        
      </div>
      <div
        style="
          background-color: #0e1a4e;
          color: #ffffff;
          padding: 20px;
          border-radius: 5px;
          margin: 20px;
          font-family: Arial, sans-serif;
        "
      >
        <p>Dear ${user.dataValues.lastName},</p>

        <p>We hope this email finds you well.</p>

        <p>
          We are delighted to inform you that the property dealing process has
          been successfully completed. This email contains detailed information
          regarding the property, along with the deal specifics and installment
          details. Additionally, a PDF document with your deal information is
          attached to this email for your reference.
        </p>

        <p style="margin-bottom: 20px">
          If you have any questions or concerns, please don't hesitate to
          contact us.
        </p>
        <p style="margin-bottom: 10px">
          Email:
          <a style="color: #ffffff" href="mailto:cmsnodemailer@gmail.com"
            >cmsnodemailer@gmail.com</a
          >
        </p>

        <p>
          Should you have any further inquiries or require assistance, feel free
          to reach out to us.
        </p>

        <p>Warm regards,</p>

        <p style="color: #ffffff">
          CMS Team<br />
          Property Developers<br />
          cmsnodemailer@gmail.com
        </p>
      </div>

      <div
        style="
          padding: 20px;
          margin: 20px;
          border: 1px solid #0e1a4e;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
        "
      >
        <h2
          style="
            color: #0e1a4e;
            font-size: 24px;
            margin-bottom: 10px;
            text-align: center;
          "
        >
          User Information
        </h2>
        <div id="userInfo">
          ${name}
          ${cnic}
          ${relation}
          ${phone}
          ${email}
          ${password}
        </div>
      </div>
      <div
        style="
          padding: 20px;
          margin: 20px;
          border: 1px solid #0e1a4e;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
        "
      >
        <h2
          style="
            color: #0e1a4e;
            font-size: 24px;
            margin-bottom: 10px;
            text-align: center;
          "
        >
          Deal Information
        </h2>
        <div id="dealInfo">
        ${dealType}
        ${duration}  
        ${productType}
          ${totalArea}
          ${unitPrice}
          ${totalPrice}
          ${commission}
          ${discount}

        </div>
      </div>
      <div
        style="
          margin: 20px;
          border: 1px solid #0e1a4e;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
        "
      >
        <h2
          style="
            color: #0e1a4e;
            font-size: 24px;
            margin-bottom: 10px;
            text-align: center;
          "
        >
          Installment Information
        </h2>
        <div style="overflow-x: auto">
          <table
            style="width: 100%; border-collapse: collapse; overflow-x: auto"
            id="installmentTable"
          >
            <thead>
              <tr>
                <th
                  style="
                    background-color: #0e1a4e;
                    color: #ffffff;
                    font-size: 14px;
                    padding: 10px;
                    text-align: left;
                  "
                >
                  Month
                </th>
                <th
                  style="
                    background-color: #0e1a4e;
                    color: #ffffff;
                    font-size: 14px;
                    padding: 10px;
                    text-align: left;
                  "
                >
                  Type
                </th>
                <th
                  style="
                    background-color: #0e1a4e;
                    color: #ffffff;
                    font-size: 14px;
                    padding: 10px;
                    text-align: left;
                  "
                >
                  Amount
                </th>
                <th
                  style="
                    background-color: #0e1a4e;
                    color: #ffffff;
                    font-size: 14px;
                    padding: 10px;
                    text-align: left;
                  "
                >
                  Due On
                </th>
              </tr>
            </thead>
            <tbody>
             ${installmentsArray.join('')}
            </tbody>
          </table>
        </div>
        </div>
        <div
        style="
          background-color: #0e1a4e;
          color: #ffffff;
          padding: 20px;
          text-align: center;
          border-radius: 0 0 5px 5px;
        "
      >
        <p>All rights reserved by CMS © 2024</p>
      </div>
        
      </div>
      </body>`
}

module.exports = {
  dealMail,
}
