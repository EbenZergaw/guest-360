import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Booking } from "@/context/GuestContext";

interface BookingHistoryProps {
  pastBookings: Booking[];
}

const BookingHistory: React.FC<BookingHistoryProps> = ({ pastBookings }) => {
  const formatBookingHistory = (bookings: Booking[]) => {
    return bookings.map((booking) => ({
      date: booking.checkInDate,
      count: 1,
    }));
  };

  const earliestBookingYear = Math.min(
    ...pastBookings.map((booking) => new Date(booking.checkInDate).getFullYear())
  );
  const earliestBookingDate = new Date(earliestBookingYear, 0, 1);

  return (
    <div className="mt-20">
      <div className="text-2xl font-bold mb-4">Booking History</div>
      <CalendarHeatmap
        startDate={earliestBookingDate}
        values={formatBookingHistory(pastBookings)}
        classForValue={(value) => {
          if (!value) {
            return 'color-empty';
          }
          return `color-scale-${value.count}`;
        }}
      />
    </div>
  );
};

export default BookingHistory;
