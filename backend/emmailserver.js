const express = require('express');
const bodyParser = require('body-parser');
const request = require('superagent');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

const app = express();
const port = 3001


app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mailchimpInstance = 'us21';
const listUniqueId = '8444b6a9e9';
const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
app.post('/subscribe', async (req, res) => {
  const { email_address } = req.body;
  console.log(req.body);

  try {
    // Check if member already exists
    const memberResponse = await request
    .get(`https://${mailchimpInstance}.api.mailchimp.com/3.0/lists/${listUniqueId}/members/${email_address}`)
    .set('Content-Type', 'application/json;charset=utf-8')
    .set('Authorization', `Basic ${Buffer.from(`any:${mailchimpApiKey}`).toString('base64')}`);

  if (memberResponse.status === 200 && memberResponse.body.status === 'subscribed') {
    res.status(400).json({ success: false, message: 'Member already exists, please try another email' });
    return;
  }
  } catch (error) {
    console.error(error.response.body);
  }

  try {
    const response = await request
      .post(`https://${mailchimpInstance}.api.mailchimp.com/3.0/lists/${listUniqueId}/members/`)
      .set('Content-Type', 'application/json;charset=utf-8')
      .set('Authorization', `Basic ${Buffer.from(`any:${mailchimpApiKey}`).toString('base64')}`)
      .send({
        email_address: email_address,
        status: 'subscribed',
      });

    console.log(response.body);
    res.status(200).json({ success: true, message: 'Subscription successful' });
  } catch (error) {
    console.error(error.response.body);
    res.status(500).json({ success: false, message: 'Subscription failed' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});