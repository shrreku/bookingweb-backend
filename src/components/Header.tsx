import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <Calendar size={24} />
          <span>AppointEase</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-blue-200">Home</Link></li>
            <li><Link to="/book" className="hover:text-blue-200">Book Appointment</Link></li>
            <li><Link to="/my-appointments" className="hover:text-blue-200">My Appointments</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;