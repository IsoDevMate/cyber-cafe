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

app.post('/add-admin', verifyToken, async (req, res) => {
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


// 1. Total Number of Users
app.get('/totalusers', verifyToken, async (req, res) => {
  const usersSnapshot = await db.collection('users').get();
  const totalUsers = usersSnapshot.size;
  res.json({ totalUsers });
});

// 2. New Clients/Users
app.get('/new-users',verifyToken, async (req, res) => {
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
app.get('/total-income', verifyToken, async (req, res) => {
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
app.get('/users-per-month', verifyToken, async (req, res) => {
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
app.get('/total-sales', verifyToken, async (req, res) => {
  const ordersSnapshot = await db.collection('orders')
    .where('status', '==', 'completed')
    .get();

  const totalSales = ordersSnapshot.size;
  res.json({ totalSales });
});

// 6. CSV Report Generation
app.get('/orders-report', verifyToken, async (req, res) => {
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