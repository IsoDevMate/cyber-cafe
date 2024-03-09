const express = require('express');
const app = express();
const admin = require('firebase-admin');
const serviceAccount = require('./ivanprojo-72b52-firebase-adminsdk-48vxh-3b0f8c89bf.json');
const csvWriter = require('csv-writer').createObjectCsvWriter;

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 1. Total Number of Users
app.get('/total-users', async (req, res) => {
  const usersSnapshot = await db.collection('users').get();
  const totalUsers = usersSnapshot.size;
  res.json({ totalUsers });
});

// 2. New Clients/Users
app.get('/new-users', async (req, res) => {
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
app.get('/total-income', async (req, res) => {
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
app.get('/users-per-month', async (req, res) => {
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

// 5. Total Sales
app.get('/total-sales', async (req, res) => {
  const ordersSnapshot = await db.collection('orders')
    .where('status', '==', 'completed')
    .get();

  const totalSales = ordersSnapshot.size;
  res.json({ totalSales });
});

// 6. CSV Report Generation
app.get('/orders-report', async (req, res) => {
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

app.listen(3000, () => {
  console.log('Server started on port 3000');
});