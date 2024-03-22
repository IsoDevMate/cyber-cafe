const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');

const connectDB = require('./db');

app.use(cors());
app.use(bodyParser.json());

app.post('/book', async (req, res) => {
  try {
    // Assuming you have a function to handle the booking logic
    const bookingDetails = await handleBooking(req.body);

    // Generate a random booking ID
    const bookingId = Math.floor(Math.random() * 1000000);

    // Prepare the SMS message
    const message = `Your booking has been confirmed!
Booking ID: ${bookingId}
Service: ${bookingDetails.serviceName}
Duration: ${bookingDetails.duration}
Expiry Time: ${bookingDetails.expiryTime}`;

    // Send the SMS
    const options = {
      to: [`+254${req.body.phoneNumber}`],
      message,
      from: '' // Set your desired sender ID
    };

    await sms.send(options);

    res.status(200).send({
      message: 'Booking successful. An SMS has been sent with the details.',
      bookingId
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred during booking.' });
  }
});

// Assuming you have a function to handle the booking logic
async function handleBooking(bookingData) {
  
  return {
    serviceName: 'Service Name',
    duration: '2 hours',
    expiryTime: '2024-03-08T18:00:00Z'
  };
}