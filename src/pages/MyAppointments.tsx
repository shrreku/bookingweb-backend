import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { getAppointments, deleteAppointment } from '../services/api';

interface Appointment {
  id: number;
  service: string;
  date: string;
  time: string;
}

const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      setError('Failed to fetch appointments');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAppointment(id);
      setAppointments(appointments.filter(apt => apt.id !== id));
    } catch (err) {
      setError('Failed to delete appointment');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {appointments.length > 0 ? (
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{appointment.service}</h3>
                <div className="flex items-center text-gray-600 mt-2">
                  <Calendar size={16} className="mr-2" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <Clock size={16} className="mr-2" />
                  <span>{appointment.time}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(appointment.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={20} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">You have no upcoming appointments.</p>
      )}
    </div>
  );
};

export default MyAppointments;