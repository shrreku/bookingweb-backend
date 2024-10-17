import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to AppointEase</h1>
      <p className="text-xl mb-8">Book appointments with ease for various services.</p>
      <Link to="/book" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
        Book an Appointment
      </Link>
    </div>
  );
};

export default Home;