import React, { useState } from 'react';
import { Typography, Button } from '@material-tailwind/react';
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
    <div className="fixed z-10 inset-0 flex items-center justify-center overflow-y-auto" role="dialog" aria-modal="true">
      <div className="inline-block bg-white rounded-lg px-4 pt-5 pb-2 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
            Reset Password
          </h3>
          <div className="mt-2">
            <input
              id="email"
              type="email"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Email address"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
        </div>
        <div className="mt-5 sm:mt-6">
          <Button
            variant="gradient"
            fullWidth
            onClick={handleResetPassword}
            className="bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          >
            Send reset link
          </Button>
        </div>
        {message && (
          <Typography variant="small" color="green" className="mt-4">
            {message}
          </Typography>
        )}
        {error && (
          <Typography variant="small" color="red" className="mt-4">
            {error}
          </Typography>
        )}
      </div>
    </div>
  );
};