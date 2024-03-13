import React, { useState } from 'react';
import {
  Button,
  Select,
  Option,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  CardBody,
} from '@material-tailwind/react';
import axios from 'axios';

export const Queue = () => {
  const [service, setService] = useState(['computer', 'internet', 'printing']);
  const [startTime, setStartTime] = useState('');
  const [email, setEmail] = useState('');
  const [preferredServiceTime, setPreferredServiceTime] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [bill, setBill] = useState(0);
  const hourlyRate = 20;

  const sendEmailToUser = async (email, service, startTime, bill) => {
    try {
      const sessionResponse = await axios.post('https://cyber-cafe-2.onrender.com/create-checkout-session', { amount: bill });
      const sessionId = sessionResponse.data.sessionId;
      const stripePaymentLink = `https://cyber-cafe-2.onrender.com/stripe-payment?session_id=${sessionId}`;

      const response = await axios.post('https://cyber-cafe-2.onrender.com/send-email', {
        email,
        service,
        startTime,
        bill,
        stripePaymentLink,
      });
      if (response.data.success) {
        console.log('Email sent successfully', response.data);
        setShowDialog(true);
      } else {
        console.error('Error sending email:', response.data.error);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleBooking = async () => {
    // Calculate the bill based on the preferred service time and hourly rate
    const serviceTimeInHours = preferredServiceTime / 60;
    const calculatedBill = serviceTimeInHours * hourlyRate;
    setBill(calculatedBill);

    try {
      // Send the email, service, and amount to the server
      const sessionResponse = await axios.post('https://cyber-cafe-2.onrender.com/create-checkout-session', {
        amount: calculatedBill,
        email: email,
        service: service,
      });
      const sessionId = sessionResponse.data.sessionId;
      const stripePaymentLink = `https://cyber-cafe-2.onrender.com/stripe-payment?session_id=${sessionId}`;

      // Store the bill in the local storage
      localStorage.setItem('bill', calculatedBill);

      // Send an email to the user
      await sendEmailToUser(email, service, startTime, calculatedBill);
    } catch (error) {
      console.error('Error creating Stripe session or sending email:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-8">Book Your Session</h1>
      <Card className="w-96">
        <CardBody className="flex flex-col space-y-4">
          <Select label="Select Service" value={service} onChange={(value) => setService(value)}>
            <Option value="computer">Computer Rental</Option>
            <Option value="internet">Internet Access</Option>
            <Option value="printing">Printing</Option>
          </Select>
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            label="Preferred Service Time (in minutes)"
            type="number"
            value={preferredServiceTime}
            onChange={(e) => setPreferredServiceTime(e.target.value)}
          />
          <Button onClick={handleBooking}>Proceed to Checkout</Button>
        </CardBody>
      </Card>
      <Dialog open={showDialog} handler={() => setShowDialog(false)}>
        <DialogHeader>Booking Successful</DialogHeader>
        <DialogBody>
          Your session has been booked successfully. You will receive an email confirmation shortly with a payment link.
          <br />
          Your bill: ${bill.toFixed(2)}
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setShowDialog(false)}>
            OK
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};