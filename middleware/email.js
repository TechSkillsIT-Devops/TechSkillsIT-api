// middleware/email.js

const path = require('path');
const nodemailer = require('nodemailer');
const Email = require('email-templates');
const template =  require('./emailTemplate')
// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 465,
    secure: true,
    auth: {
        user: 'info@techskillsit.com',
        pass: process.env.EMAIL_PASS,
    },
});

// Specify the absolute path to your templates folder
const templatesPath = path.join(__dirname);  // Go up one level from 'middleware' to the project root and into 'email-templates'

// Create an instance of the email-templates library with the 'views' option
const email = new Email({
    message: {
        from: 'info@techskillsit.com',
        contentType: 'text/html'
    },
    transport: transporter,
    send: true,
   
    preview: false,
    views: {
        root: templatesPath,
        options : {
            extension : 'ejs'
        },
    },
});

// Define the email sending function
const sendEmail = async (recipient, subject, templateName, emaildata ) => {
    console.log("Sending email");
    try {
        const options ={
            template: templateName,  // Use the provided templateName variable
            message: {
                to: recipient,
                subject: subject,
                html : template.emailVerificationTemplate(emaildata) ,
                attachments: [
                    {
                        filename: 'logo.png',
                        path: path.join(__dirname, 'logo.png'),  // Adjust this path based on the location of your logo
                        cid: 'logo',
                    },
                ]
            }
        }
        
        //console.log('Template file path:', path.join(templatesPath, `${templateName}.hbs`));
        const result = await email.send(options).catch(err=> console.log(err));
       // console.log('Rendered HTML content:', result.originalMessage.html)

        // console.log('Email sent successfully:', result);

        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        //throw error;
    }
};



//sendEmail('jha.riki32@gmail.com','Email-verification','login',emaildata).then()

// Export the function
 module.exports = {sendEmail};
