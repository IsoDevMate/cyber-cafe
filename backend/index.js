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
const sendgridMail = require('@sendgrid/mail');
const multer = require('multer');
const path = require('path');
const firebase = require('firebase-admin');
//const { nanoid } = require('nanoid/non-secure');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const corsOptions = {
  origin: '*', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
  allowedHeaders: 'Content-Type, Authorization' 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const generateToken = (email) => {
  const secret = process.env.JWT_SECRET ;
  const token = jwt.sign({ email }, secret, { expiresIn: '1h' });
  return token;
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'ivanprojo-72b52.appspot.com'
});

const db = admin.firestore();

const storage = firebase.storage();

 const upload = multer({
   storage: multer.memoryStorage(),
 });

const ordersCollection = db.collection('orders');

sendgridMail.setApiKey(process.env.SENDGRID_APIKEY);

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

app.get('/', (req, res) => {
  res.send('Welcome to the Cyber Cafe API');
})


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
     success_url :`${process.env.DOMAIN}/success?email=${encodeURIComponent(email)}&amount=${amount}&service=${encodeURIComponent(service)}`,
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
app.get('/ordersreport', async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;
    const orders = await getOrdersFromFirestore(startDate, endDate, limit);
    const totalSales = calculateTotalSales(orders);
    const totalIncome = calculateTotalIncome(orders);

    const csvData = generateCSVData(orders, totalSales, totalIncome);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="orders-report.csv"');
    res.status(200).send(csvData);
  } catch (error) {
    console.error('Error downloading report:', error);
    res.status(500).send('Error downloading report');
  }
});

const getOrdersFromFirestore = async (startDate, endDate, limit) => {
  const validStartDate = startDate ? new Date(startDate) : new Date(0);
  const validEndDate = endDate ? new Date(endDate) : new Date(); 

  if (isNaN(validStartDate.getTime()) || isNaN(validEndDate.getTime())) {
    // Handle invalid date format
    return res.status(400).json({ error: 'Invalid date format' });
  }

  const query = db.collection('orders')
    .where('createdAt', '>=', validStartDate)
    .where('createdAt', '<=', validEndDate)
    .limit(parseFloat(limit));

  const snapshot = await query.get();
  const orders = [];
  snapshot.forEach(doc => orders.push(doc.data()));
  return orders;
};

const calculateTotalSales = (orders) => {
  return orders.reduce((total, order) => total + order.amount, 0);
};

const calculateTotalIncome = (orders) => {
  return orders.reduce((total, order) => total + order.amount, 0);
};

const generateCSVData = (orders, totalSales, totalIncome) => {
  const csvRows = [];
  const headers = ['Email', 'Service', 'Amount', 'Status', 'Created At'];
  csvRows.push(headers.join(','));

  orders.forEach(order => {
    const row = [
      order.email || '',
      order.service || '',
      order.amount,
      order.status,
      order.createdAt.toDate().toISOString(),
    ];
    csvRows.push(row.join(','));
  });

  csvRows.push('\n');
  csvRows.push(`Total Sales,${totalSales}`);
  csvRows.push(`Total Income,${totalIncome}`);

  return csvRows.join('\n');
};

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const file = req.file;
  const fileExtension = path.extname(file.originalname);
  const fileName = `${Date.now()}${fileExtension}`;

  try {
    const fileRef = storage.bucket().file(`uploads/${fileName}`);
    await fileRef.save(file.buffer, { contentType: file.mimetype });
    const imageUrl = await fileRef.getSignedUrl({ action: 'read', expires: '03-09-2491' });
    res.json({ success: true, image_url: imageUrl[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to upload file.' });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
