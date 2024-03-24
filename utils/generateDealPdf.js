const puppeteer = require('puppeteer')
const path = require('path')
async function generatePDF(user, deal, installments) {
  const name = `${user.dataValues.firstName + ' ' + user.dataValues.lastName}`
  const cnic = `<p><strong>CNIC:</strong> ${user.dataValues.cnic}</p>`
  const relation = `<p><strong>${user.dataValues.relation}:</strong> ${user.dataValues.relationName}</p>`
  const email = `<p><strong>Email:</strong> ${user.dataValues.email}</p>`
  const phone = `<p><strong>Phone:</strong> ${user.dataValues.phone}</p>`

  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const dealInfo = {
      productType: 'Appartment',
      measuringUnit: 'Unit',
      unitPrice: 'PKR 13,000',
      totalPrice: 'PKR 1,300,000',
      discountPercentage: '10%',
      dealType: 'Sale',
      duration: '1 year',
      rentPercentage: '3%',
      createdAt: 'January 1, 2023',
    }

    const installmentData = [
      { month: 'January', date: '2024-01-15', amount: '$500', type: 'Type A' },
      { month: 'February', date: '2024-02-15', amount: '$500', type: 'Type B' },
      { month: 'March', date: '2024-03-15', amount: '$500', type: 'Type C' },
      { month: 'January', date: '2024-01-15', amount: '$500', type: 'Type A' },
      { month: 'February', date: '2024-02-15', amount: '$500', type: 'Type B' },
      { month: 'March', date: '2024-03-15', amount: '$500', type: 'Type C' },
      { month: 'January', date: '2024-01-15', amount: '$500', type: 'Type A' },
      { month: 'February', date: '2024-02-15', amount: '$500', type: 'Type B' },
      { month: 'March', date: '2024-03-15', amount: '$500', type: 'Type C' },
      { month: 'January', date: '2024-01-15', amount: '$500', type: 'Type A' },
      { month: 'February', date: '2024-02-15', amount: '$500', type: 'Type B' },
      { month: 'March', date: '2024-03-15', amount: '$500', type: 'Type C' },
      // Add more installment data as needed
    ]

    const dealInfoLabels = {
      productType: 'Product Type',
      measuringUnit: 'Measuring Unit',
      unitPrice: 'Unit Price',
      totalPrice: 'Total Price',
      discountPercentage: 'Discount Percentage',
      dealType: 'Deal Type',
      duration: 'Duration',
      rentPercentage: 'Rent Percentage',
      createdAt: 'Booked At',
    }

    // Populate user info
    let userInfoHTML = ''
    userInfoHTML += '<div class="info">'
    userInfoHTML += cnic + relation + email + phone
    userInfoHTML += '</div>'

    // Populate deal info
    let dealInfoHTML = ''
    dealInfoHTML += '<div class="info">'
    Object.keys(dealInfo).forEach((key) => {
      dealInfoHTML += `<p><strong>${dealInfoLabels[key]}:</strong> ${dealInfo[key]}</p>`
    })
    dealInfoHTML += '</div>'

    // Populate installment info
    let installmentTableHTML = `<table id="installmentTable">
                                  <thead>
                                    <tr>
                                      <th>Month</th>
                                      <th>Date</th>
                                      <th>Amount</th>
                                      <th>Type</th>
                                    </tr>
                                  </thead>
                                  <tbody>`
    installmentData.forEach((installment) => {
      installmentTableHTML += `<tr>
                                  <td>${installment.month}</td>
                                  <td>${installment.date}</td>
                                  <td>${installment.amount}</td>
                                  <td>${installment.type}</td>
                                </tr>`
    })
    installmentTableHTML += `</tbody></table>`

    // Load HTML content into the page
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Template</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 800px;
            -webkit-print-color-adjust: exact;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            margin-bottom: 50px;
            border : 1px solid #0e1a4e;
            border-left : 1px solid #0e1a4e;
            border-bottom : 9px solid #0e1a4e;
            border-top : 9px solid #0e1a4e;
            border-radius : 10px ;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding: 10px;
            margin-left: 10px;
          }
          
          .header img {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            border: 7px solid #0e1a4e;
            margin-right: 10px;
          }
          
          .Logo_Text {
            font-family: 'Arial', sans-serif;
            font-size: 36px;
            font-weight: bold;
            color: #0e1a4e;
            margin: 0;
            padding : 0 ;
          }
          
          .slogan {
            font-family: 'Arial', sans-serif;
            font-size: 18px;
            font-weight: bold;
            color: #0e1a4e;
            margin: 0;
          }          
          .header_logo_text{
            display : flex ; 
            flex-direction :column ;
            align-items :center ;
            justify-content : center ;
          }
          .section {
            padding: 10px;
            background-color: #ffffff;
            margin-left: 12px;
            margin-right : 12px;
          }
          
          h2 {
            color: #0e1a4e;
            font-size: 30px;
            margin-bottom: 10px;
            text-align: center;
          }
          
          .info {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            margin-bottom: 20px;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            background-color: #f9f9f9;
            color: #333;
            font-size: 14px;
          }
          .info p {
            margin: 5px 0;
          }
          
          .info strong {
            color: #0e1a4e;
            font-weight: bold;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            overflow-x: auto;
          }
          
          th,
          td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #dddddd;
          }
          
          th {
            background-color: #0e1a4e;
            color: #ffffff;
            font-size: 18px;
          }
          
          td {
            font-size: 16px;
          }  
          @media (max-width: 600px) {
            .section {
              display: flex;
              flex-direction: column;
            }
          
            .info {
              grid-template-columns: repeat(1, 1fr);
            }
          
            th,
            td {
              min-width: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
  <img src="data:image/png;base64,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" alt="Logo">
  <div class="header_logo_text">
  <h2 class="Logo_Text">CMS</h2>
  </div>
</div>

  <div class="section">
  <h2>${name} </h2>
  <div id="userInfo">${userInfoHTML}</div>
</div>

<div class="section">
  <h2>${dealInfo.productType} | ${dealInfo.totalPrice}</h2>
  <div id="dealInfo">${dealInfoHTML}</div>
</div>

<div class="section">
  <h2>Installment Information</h2>
  ${installmentTableHTML}
</div>
  </div>
        </div>
      </body>
      </html>
    `)

    // Generate PDF
    const pdf = await page.pdf({
      path: `${path.join('utils', 'pdfs', `Deal${deal.dataValues.id}.pdf`)}`,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '10px',
        right: '10px',
      },
    })

    await browser.close()

    console.log(pdf.path)
  } catch (error) {
    console.log('Error generating PDF:', error)
  }
}

module.exports = { generatePDF }
