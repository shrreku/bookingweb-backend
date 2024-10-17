import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { createAppointment } from '../services/api';
import { useNavigate } from 'react-router-dom';

const BookAppointment: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAppointment({ service: selectedService, date: selectedDate, time: selectedTime });
      navigate('/my-appointments');
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        {/* ... (rest of the form remains the same) ... */}
      </form>
    </div>
  );
};

export default BookAppointment;