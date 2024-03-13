
import  React, { useState } from 'react';
import { db, collection, addDoc } from '../firebase';
import  {useAuth } from '../auth/context/auth';
export const Contact = () => {
  const [showAlert, setShowAlert] = useState(false);
 const { user } = useAuth();
 
  const submitForm = async (e) => {
    e.preventDefault();

    const name = e.target.elements.name.value;
    const company = e.target.elements.company.value;
    const email = e.target.elements.email.value;
    const phone = e.target.elements.phone.value;
    const message = e.target.elements.message.value;

    await saveMessage(name, company, email, phone, message);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    e.target.reset();
  };

  const saveMessage = async (name, company, email, phone, message) => {
    try {
      const messagesRef = collection(db, 'messages');
      await addDoc(messagesRef, {
        name,
        company,
        email,
        phone,
        message,
      },{ merge: true}
      );
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="brand text-center text-3xl font-bold mb-8">
        <span className="text-white">Ivan</span>Cyber Cafe Services
      </h1>
      <div className="wrapper bg-white shadow-md rounded-lg">
        <div className="company-info bg-blue-100 p-8 rounded-l-lg">
          <h3 className="text-center text-2xl mb-4">Ivan Cyber Cafe Services</h3>
          <ul>
            <li className="flex items-center mb-2">
              <i className="fa fa-road mr-2"></i> 27th Street Bypass
            </li>
            <li className="flex items-center mb-2">
              <i className="fa fa-phone mr-2"></i> (254) 7345-56789
            </li>
            <li className="flex items-center">
              <i className="fa fa-envelope mr-2"></i> info@cyberivan.com
            </li>
          </ul>
        </div>
        <div className="contact p-8">
          <h3 className="text-2xl mb-4">Email Us</h3>
          {showAlert && (
            <div className="alert bg-green-500 text-white p-4 mb-4">
              Your message has been sent
            </div>
          )}
          <form id="contactForm" onSubmit={submitForm}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="w-full p-2 border border-blue-200 rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="company" className="block mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  className="w-full p-2 border border-blue-200 rounded"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full p-2 border border-blue-200 rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  className="w-full p-2 border border-blue-200 rounded"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="message" className="block mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="5"
                  className="w-full p-2 border border-blue-200 rounded"
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-200 text-blue-800 py-2 px-4 rounded hover:bg-blue-300 transition-colors duration-300"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


