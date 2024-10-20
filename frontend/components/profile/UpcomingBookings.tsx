import React from 'react';
import { Booking } from '@/context/GuestContext';

interface UpcomingBookingsProps {
  bookings: Booking[];
}

const UpcomingBookings: React.FC<UpcomingBookingsProps> = ({ bookings }) => {
  return (
    <div className="mt-10">
      <div className="text-2xl font-bold mb-3">Upcoming Bookings</div>
      {bookings.map((booking, index) => ( 
        <div
          key={index}
          className="border p-4 rounded-lg my-3 flex items-center justify-between"
        >
          <div className="flex flex-col">
            <span className="text-xl font-bold">{booking.city}</span>
            <span className="font-semibold">Hotel:</span>
            <span>{booking.hotel}</span>
            <span className="text-sm text-neutral-500 mt-2">
              {booking.checkInDate} - {booking.checkOutDate}
            </span>
          </div>
          <div className="flex items-center">
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Rooms:</span>
                <span>{booking.numberOfRooms}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Guests:</span>
                <span>{booking.numberOfGuests}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingBookings;
