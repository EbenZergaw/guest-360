"use client";
import React from "react";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { useGuests } from "../../../context/GuestContext";
import { Slider } from "@/components/ui/slider";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import GuestEditModal from "@/components/GuestEditModal";
import Preferences from "@/components/profile/Preferences";
import { GuestInfo } from "@/components/profile/GuestInfo";
import BookingHistory from "@/components/profile/BookingHistory";
import UpcomingBookings from "@/components/profile/UpcomingBookings";
import PastBookings from "@/components/profile/PastBookings";
import GetInsights from "@/components/GetInsights";

export default function AdminView() {
  const id = useParams().id;
  const { guests } = useGuests();

  const guest = guests.find((g) => g.bonvoy_id === id);

  const preferences = guest?.preferences;

  if (!guest) {
    return <div>Guest not found</div>;
  }

  const earliestBookingYear = Math.min(
    ...guest.past_bookings.map((booking: any) =>
      new Date(booking.checkInDate).getFullYear()
    )
  );

  return (
    <div>
      <GuestEditModal guest={guest} />
      <GetInsights preferences={guest.preferences} />
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-4 items-stretch justify-between">
          <GuestInfo guest={guest} />

          <UpcomingBookings
            bookings={guest.upcoming_bookings}
          ></UpcomingBookings>
        </div>

        <div>
          <Preferences preferences={preferences} />
        </div>
      </div>

      <BookingHistory pastBookings={guest.past_bookings}></BookingHistory>

      <PastBookings pastBookings={guest.past_bookings}></PastBookings>
    </div>
  );
}
