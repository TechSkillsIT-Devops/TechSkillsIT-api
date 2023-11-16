 const emailVerificationTemplate = ({title,message, otp})=>{
  return  `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body {
              font-family: Arial, sans-serif;
              
              padding: 20px;
              color: #ffffff;
          }
  
          .content {
              background-color: rgba(0, 0, 0, 0.7);
              padding: 20px;
              border-radius: 10px;
          }
  
          h1 {
              color: #ffffff;
          }
          p {
            color: black;
        }
        .otp-container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

        .otp {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #e44d26; /* Adjust the color as needed */
            margin-top: 10px;
        }

        .otp h1 {
            display: inline-block;
            margin: 0 8px; /* Adjust the gap between numbers as needed */
        }
        .note {
            margin-top: 20px; /* Adjust the spacing between OTP and note */
            text-align: center;
            background-color: #f8d7da; /* Highlight color */
            color: #721c24; /* Text color for the highlight */
            padding: 10px;
            border-radius: 5px; /* Rounded corners for better appearance */
          } 

          @media only screen and (max-width: 600px) {
            .otp h1 {
              margin: 0 4px; /* Adjust the gap for smaller screens */
            }
      </style>
  </head>
  <body>
      <div class="content">
       <img src="cid:logo">
          <h1>${ title }</h1>
          <p>${ message }</p>
          <div class="otp-container">
          <p class="otp">Your OTP: <h1>${otp}</h1></p>
          </div>
      </div>
      <div class="note">
      <p>Note*: This OTP will expire in 15 minutes.</p>
    </div>
  </body>
  </html>`
  
  
 }

 module.exports = {emailVerificationTemplate}