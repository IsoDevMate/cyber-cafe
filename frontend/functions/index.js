const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sendgridMail = require('@sendgrid/mail');
const cors = require('cors')({ origin: true });
admin.initializeApp();

// Replace with your SendGrid API key
sendgridMail.setApiKey();

exports.sendBookingConfirmation = functions.https.onCall(async (data, context) => {
  return cors(null, context.rawRequest, context.rawResponse, async () => {
  const { email, service, startTime, bill } = data;

  const msg = {
    to: email,
    from: 'oumabarack1047@gmail.com', 
    subject: 'Booking Confirmation',
    text: `Your ${service} session has been booked for ${startTime}. Your bill is $${bill.toFixed(2)}.`,
  };

  try {
    await sendgridMail.send(msg);
    console.log('Email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.toString() };
  }
}
  );
}
);