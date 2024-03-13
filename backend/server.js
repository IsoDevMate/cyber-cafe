const express = require('express');
const app = express();
const admin = require('firebase-admin');
const serviceAccount = require('./ivanprojo-72b52-firebase-adminsdk-48vxh-3b0f8c89bf.json');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const verifyToken = require('./middlewares/verifytoken');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const sendgridMail = require('@sendgrid/mail');
//const { nanoid } = require('nanoid/non-secure');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const generateToken = (email) => {
  const secret = process.env.JWT_SECRET ;
  const token = jwt.sign({ email }, secret, { expiresIn: '1h' });
  return token;
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const ordersCollection = db.collection('orders');

sendgridMail.setApiKey(process.env.SENDGRID_APIKEY);

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};


app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || email.trim() === '') {
    return res.status(400).json({ error: 'Admin email is missing or invalid' });
  }

  try {
    const hashedPassword = await hashPassword(password);

    const adminRef = db.collection('admins').doc();
    await adminRef.set({ password: hashedPassword, isSuperUser: true });

    res.status(200).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

//addAdmin()
//.catch(error => {
 // console.error('Error adding admin:', error);
//});

app.get('/firestore', (req, res) => {
  res.json({ firestore: admin.firestore() });
});


app.post('/addadmin', async (req, res) =>{
  const { email, password } = req.body;
  const adminEmail = req.admin.email; // Get the email of the authenticated admin
  try {
    // Check if the authenticated admin is the super user
    const adminRef = db.collection('admins').doc(adminEmail);
    const adminDoc = await adminRef.get();

    if (!adminDoc.exists || !adminDoc.data().isSuperUser) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Hash the new admin's password
    const hashedPassword = await hashPassword(password);

    // Create a new admin document
    const newAdminRef = db.collection('admins').doc(email);
    await newAdminRef.set({ password: hashedPassword, isSuperUser: false });

    res.status(200).json({ message: 'Admin added successfully' });
  } catch (error) {
    console.error('Error adding admin:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/send-email', async (req, res) => {
  const { email, service, startTime, bill, stripePaymentLink } = req.body;

  const msg = {
    to: email,
    from: 'oumabarack1047@gmail.com',
    subject: 'Booking Confirmation',
    text: `Your ${service} session has been booked for ${startTime}. Your bill is $${bill.toFixed(2)}. Payment link: ${stripePaymentLink}`,
  };

  try {
    await sendgridMail.send(msg);
    console.log('Email sent successfully');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.toString() });
  }
});



app.post('/create-checkout-session', async (req, res) => {
  const { amount, email, service } = req.body;
 

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.DOMAIN}/success?email=${email}&amount=${amount}&service=${service}`,
      cancel_url: `${process.env.DOMAIN}/cancel`,
      //customer: user.stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: 'usd', 
            product_data: {
              name: 'Service Payment',
            },
            unit_amount: Math.round(amount * 100),  
          },
          quantity: 1,
        },
      ],
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/success', async (req, res) => {
  const { email, amount, service } = req.query;

  try {
    
    await ordersCollection.add({
      email,
      amount: parseFloat(amount),
      service,
      status: 'completed',
      createdAt: new Date(),
    });

    res.send('Payment successful');
  } catch (error) {
    console.error('Error recording order:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/cancel', async (req, res) => {
  const { email, amount, service } = req.query;

  try {
    await ordersCollection.add({
      email,
      amount,
      service,
      status: 'cancelled',
      createdAt: new Date(),
    });

    res.send('Payment cancelled');
  } catch (error) {
    console.error('Error recording order:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


app.get('/completed-orders', async (req, res) => {
  try {
    const completedOrdersSnapshot = await ordersCollection
      .where('status', '==', 'completed')
      .get();

    const completedOrders = completedOrdersSnapshot.docs.map((doc) => doc.data());

    res.json(completedOrders);
  } catch (error) {
    console.error('Error retrieving completed orders:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/cancelled-orders', async (req, res) => {
  try {
    const cancelledOrdersSnapshot = await ordersCollection
      .where('status', '==', 'cancelled')
      .get();

    const cancelledOrders = cancelledOrdersSnapshot.docs.map((doc) => doc.data());

    res.json(cancelledOrders);
  } catch (error) {
    console.error('Error retrieving cancelled orders:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
})

app.post('/orders', async (req, res) => {
  const { email, amount, status } = req.body;

  try {
    const orderRef = db.collection('orders').doc();
    await orderRef.set({ email, amount, status, createdAt: new Date() });

    res.status(200).json({ message: 'Order added successfully' });
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
})


// 1. Total Number of Users
app.get('/totalusers', async (req, res) => {
  const usersSnapshot = await db.collection('users').get();
  const totalUsers = usersSnapshot.size;
  res.json({ totalUsers });
});


// 2. New Clients/Users
app.get('/newusers', async (req, res) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const newUsersQuery = db.collection('users')
    .where('createdAt', '>=', startOfToday)
    .where('createdAt', '<', endOfToday);

  const newUsersSnapshot = await newUsersQuery.get();
  const newUsers = newUsersSnapshot.size;
  res.json({ newUsers });
});

// 3. Total Income
app.get('/totalincome',  async (req, res) => {
  const ordersSnapshot = await db.collection('orders')
    .where('status', '==', 'completed')
    .get();

  let totalIncome = 0;
  ordersSnapshot.forEach(doc => {
    totalIncome += doc.data().amount;
  });
  
  res.json({ totalIncome });
});


// 4. Total Users per Month
app.get('/userspermonth', async (req, res) => {
  const usersPerMonth = {};
  const usersSnapshot = await db.collection('users').get();

  usersSnapshot.forEach(doc => {
    const createdAt = doc.data().createdAt.toDate();
    const month = `${createdAt.getFullYear()}-${createdAt.getMonth() + 1}`;
    if (usersPerMonth[month]) {
      usersPerMonth[month]++;
    } else {
      usersPerMonth[month] = 1;
    }
  });

  res.json(usersPerMonth);
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminRef = db.collection('admins').doc(email);
    const adminDoc = await adminRef.get();

    if (!adminDoc.exists) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const adminData = adminDoc.data();
    const hashedPassword = adminData.password;

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const idToken = await admin.auth().createCustomToken(email);
    return res.status(200).json({ idToken });
  } catch (error) {
    console.error('Error logging in admin:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
}); 

// 5. Total Sales
app.get('/totalsales', async (req, res) => {
  const ordersSnapshot = await db.collection('orders')
    .where('status', '==', 'completed')
    .get();

  const totalSales = ordersSnapshot.size;
  res.json({ totalSales });
});

// 6. CSV Report Generation
app.get('/ordersreport',  async (req, res) => {
  const ordersSnapshot = await db.collection('orders').get();
  const orders = [];

  ordersSnapshot.forEach(doc => {
    orders.push(doc.data());
  });

  const csvWriter = csvWriter({
    path: 'path/to/orders-report.csv',
    header: [
      { id: 'id', title: 'Order ID' },
      { id: 'userId', title: 'User ID' },
      { id: 'amount', title: 'Amount' },
      { id: 'status', title: 'Status' },
      { id: 'createdAt', title: 'Created At' },
    ]
  });

  csvWriter.writeRecords(orders)
    .then(() => {
      res.download('path/to/orders-report.csv', 'orders-report.csv', (err) => {
        if (err) {
          console.error('Error downloading report:', err);
          res.status(500).send('Error downloading report');
        }
      });
    })
    .catch(err => {
      console.error('Error writing report:', err);
      res.status(500).send('Error writing report');
    });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});