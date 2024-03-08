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
} from '@material-tailwind/react';

export const Queue = () => {
  const [service, setService] = useState('');
  const [startTime, setStartTime] = useState('');
  const [email, setEmail] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const handleBooking = () => {
    // Perform booking logic here
    // Redirect to /checkout after successful booking
    setShowDialog(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-8">Book Your Session</h1>
      <div className="flex flex-col items-center space-y-4">
        <Select
          label="Select Service"
          value={service}
          onChange={(value) => setService(value)}
        >
          <Option value="computer">Computer Rental</Option>
          <Option value="internet">Internet Access</Option>
          <Option value="printing">Printing</Option>
        </Select>
        <Input
          label="Start Time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <Input
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleBooking}>Proceed to Checkout</Button>
      </div>
      <Dialog open={showDialog} handler={() => setShowDialog(false)}>
        <DialogHeader>Booking Successful</DialogHeader>
        <DialogBody>
          Your session has been booked successfully. You will receive an email
          confirmation shortly.
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

