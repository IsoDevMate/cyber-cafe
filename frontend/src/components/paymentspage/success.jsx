/*import React from 'react';
import { useAuth } from '../../auth/context/auth';
import { useNavigate } from 'react-router-dom';
export const Success = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const handleGoBack  = () => {
        navigate( user ? '/' : '/signin');
    }
  return (
    <>
      <div className="bg-gray-100 h-screen">
        <div className="bg-white p-6 md:mx-auto">
          <svg viewBox="0 0 24 24" className="text-navy-600 w-16 h-16 mx-auto my-6">
            <path
              fill="currentColor"
              d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
            />
          </svg>
          <div className="text-center">
            <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
              Payment Cancelled
            </h3>
            <p className="text-gray-600 my-2">Your payment has been cancelled.</p>
            <p className="mb-10">You can try again later.</p>
            <div className="text-center">
                  
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
import { FaCheck } from "react-icons/fa";
import { Link } from 'react-router-dom';
import './success.css'

export const Success = () => {
  return (
    <div className='main'>
        <div className='success-page'>
            <div className="success-icon">
                <FaCheck />
            </div>
            <h1>Payment Successful</h1>
            <h3>Your payment has been processed Successfully</h3>
            <p>Click on the button below to continue shopping</p>
            <Link to= '/' >
                <button>Continue Using our Services</button>
            </Link>
            
        </div>
    </div>
    
  )
}