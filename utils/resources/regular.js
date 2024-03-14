const regularMail = (messageTitle, messageBody, actionTitle, actionLink) => {
  return `<div
      style="
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        border-radius: 10px;
      "
    >
      <div>
        <div style="text-align: center; padding-top: 20px">
          <img
            style="
              width: 40px;
              height: 40px;
              border-radius: 50%;
              border: 3px solid #0e1a4e;
            "
            src="cid:logo"
            alt="Logo"
          />
        </div>
        <div style="padding: 10px; text-align: center">
          <h2 style="color: #0e1a4e; font-size: 24px; margin-bottom: 10px">
            ${messageTitle}
          </h2>
          <p style="color: #333333; font-size: 16px; line-height: 1.6">
            ${messageBody}
          </p>
          <a href="${actionLink}" target="_blank" style="cursor:pointer;"
            ><button
              style="
                padding: 10px;
                background-color: #0e1a4e;
                border-radius: 5px;
                color: white;
                border: 1px solid white;
                cursor: pointer;
              "
            >
              ${actionTitle}
            </button></a
          >
        </div>
      </div>
    </div>`
}

module.exports = {
  regularMail,
}
