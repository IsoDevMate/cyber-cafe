
/* import React from 'react';
   import { useNavigate } from 'react-router-dom';
   import { useAuth } from '../../auth/context/auth';

export const Cancel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const handleGoBack  = () => {
        navigate( user ? '/' : '/signin');
    }
  return (
    <>
      <div className="bg-gray-100 h-screen">
        <div className="bg-white p-6 md:mx-auto">
          <svg
            viewBox="0 0 24 24"
            className="text-red-600 w-16 h-16 mx-auto my-6"
          >
            <path
              fill="currentColor"
              d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm5.936,8.28-5.64,5.64a1,1,0,0,1-1.414,0L6.064,10.1a1,1,0,1,1,1.414-1.414L11.5,12.708l5.015-5.015a1,1,0,1,1,1.414,1.414Z"
            ></path>
          </svg>
          <div className="text-center">
            <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
              Payment Cancelled
            </h3>
            <p className="text-gray-600 my-2">
              Your payment has been cancelled.
            </p>
            <p>You can try again later.</p>
            <div className="py-10 text-center">
            <button
                onClick={handleGoBack}
                className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
                >
                GO BACK
            </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
*/



import React from 'react'
import './cancel.css'
import { CgDanger } from "react-icons/cg";
import { Link } from 'react-router-dom';

export const Cancel = () => {
  return (
    <div className='main'>
        <div className='fail-page'>
            <div className="fail-icon">
                <CgDanger />
            </div>
            <h1>Payment Unsuccessful</h1>
            <h3>Error Processing your payment</h3>
            <p>Click on the button to go back</p>
            <Link to= '/queue' >
                <button>Back</button>
            </Link>
            
        </div>
    </div>
  )
}

