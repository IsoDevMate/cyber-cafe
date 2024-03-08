import React, { useState } from 'react';
import { Typography } from '@material-tailwind/react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../src/firebase';

export const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Check your inbox.');
      setError('');
    } catch (error) {
      setError(`Error sending password reset email: ${error.message}`);
      setMessage('');
    }
  };

  return (
    <div>
      <Typography variant="h6">Reset Password</Typography>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
      />
      <button onClick={handleResetPassword}>Reset Password</button>
      {message && (
        <Typography variant="small" color="green">
          {message}
        </Typography>
      )}
      {error && (
        <Typography variant="small" color="red">
          {error}
        </Typography>
      )}
    </div>
  );
};

