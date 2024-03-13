import React from 'react';
import { Services } from './services';
import { Footer } from './footer';
import { FaPlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/context/auth';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleGetStarted = () => {
    if (user) {
      navigate('/services');
    } else {
      navigate('/signin');
    }
  };
  return (
    <>
      <section className="bg-gray-100 py-24">
        <div className="grid max-w-7xl mx-auto grid-cols-1 md:grid-cols-2 items-center">
          <div className="mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Your Number One <br />
              products & Tech service Assistant
            </h1>
            <p className="text-gray-600 mb-8">
              Dedicate your Day to Day Online tasks to us <br />
              using the internat cannot be Hefty with us <br />
              IVan Cyber Cafe System.
            </p>
            <div className="space-x-4">
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 animate-bounce"
          >
            <FaPlay className="w-4 h-4 mr-2" /> Get Started
          </button>
        </div>
          </div>
          <div className=" md:block rounded">
            <img
              src="https://cdn.tailgrids.com/1.0/assets/images/blogs/blog-02/image-01.jpg"
              alt="Hero"
              className="mx-auto"
            />
          </div>
        </div>
      </section>
      <Services />
      <Footer />
    </>
  );
};