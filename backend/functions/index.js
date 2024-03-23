const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret_key);
const twilio = require('twilio')(functions.config().twilio.account_sid, functions.config().twilio.auth_token);
const serviceAccount = require('./ivanprojo-72b52-firebase-adminsdk-48vxh-3b0f8c89bf.json');
const cors = require('cors')({ origin: true });
const getRawBody = require('raw-body');
const express = require('express');
const app = express();

// Setting timeout and memory for the deploy
const runtimeOpts = {
  timeoutSeconds: 540,
  memory: '2GB'
}


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

exports.stripeWebhook = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {

  let event;

  try {
    const rawBody = await getRawBody(request);
    //const body = request.rawBody.toString();
    console.log(`Webhook received! Raw body: ${rawBody}`)
  event = stripe.webhooks.constructEvent(
      body,
      request.headers['stripe-signature'],
      functions.config().stripe.payments_webhook_secret
    ); 
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }
  

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const customerEmail = session.customer_details.email;
      const customerPhone = session.customer_details.phone;
      const amount = session.amount_total / 100;
      const paymentTime = new Date(session.payment_intent.created * 1000);

      // Store order details in Firestore
      await db.collection('orders').add({
        email: customerEmail,
        amount,
        service: session.line_items.data[0].description,
        paymentTime,
        status: 'completed',
      });

      sendSMS(customerPhone, `Payment successful! Amount: $${amount} Service: ${session.line_items.data[0].description} Paid at: ${paymentTime.toLocaleString()}`);
      break;

    case 'checkout.session.expired':
      const expiredSession = event.data.object;
      const expiredPhone = expiredSession.customer_details.phone;

      sendSMS(expiredPhone, 'Your payment link has expired. Please try again.');
      break;

    case 'checkout.session.async_payment_failed':
      const failedSession = event.data.object;
      const failedPhone = failedSession.customer_details.phone;

      sendSMS(failedPhone, 'Payment failed. Please try again.');
      break;

    default:
      console.log(`Unhandled event type ${event.type}.`);
  }

  response.status(200).send("ok").end();
});

function sendSMS(phoneNumber, message) {
  twilio.messages
    .create({
      body: message,
      from: functions.config().twilio.phone_number,
      to: phoneNumber,
    })
    .then((message) => console.log(`SMS sent: ${message.sid}`))
    .catch((error) => console.error(`Error sending SMS: ${error}`));
}
}
)


exports.stripeWebhook = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
      const event = request.rawBody;
  
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log('Payment intent succeeded:', paymentIntent);
          // Handle the successful payment intent
          handlePaymentIntentSucceeded(paymentIntent);
          break;
  
        case 'payment_method.attached':
          const paymentMethod = event.data.object;
          console.log('Payment method attached:', paymentMethod);
          // Handle the successful attachment of a PaymentMethod
          handlePaymentMethodAttached(paymentMethod);
          break;
  
        // ... handle other event types
  
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
  
      response.json({ received: true });
    });
  });
  
  function handlePaymentIntentSucceeded(paymentIntent) {
    // Your code to handle a successful payment intent
    // For example, you can store the payment details in Firestore
    const customerEmail = paymentIntent.charges.data[0].billing_details.email;
    const amount = paymentIntent.charges.data[0].amount / 100;
    const paymentTime = new Date(paymentIntent.charges.data[0].created * 1000);
  
    db.collection('orders').add({
      email: customerEmail,
      amount,
      paymentTime,
      status: 'completed',
    });
  
    // You can also send an SMS notification
    const customerPhone = paymentIntent.charges.data[0].billing_details.phone;
    sendSMS(customerPhone, `Payment successful! Amount: $${amount} Paid at: ${paymentTime.toLocaleString()}`);
  }
  
  function handlePaymentMethodAttached(paymentMethod) {
    // Your code to handle the successful attachment of a PaymentMethod
    // For example, you can store the payment method details in Firestore
    const customerId = paymentMethod.customer;
    const paymentMethodId = paymentMethod.id;
  
    db.collection('customers').doc(customerId).collection('paymentMethods').doc(paymentMethodId).set({
      paymentMethodId,
      created: paymentMethod.created,
    });
  }
  
  function sendSMS(phoneNumber, message) {
    twilio.messages
      .create({
        body: message,
        from: functions.config().twilio.phone_number,
        to: phoneNumber,
      })
      .then((message) => console.log(`SMS sent: ${message.sid}`))
      .catch((error) => console.error(`Error sending SMS: ${error}`));
  }