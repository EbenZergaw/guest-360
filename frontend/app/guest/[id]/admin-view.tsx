"use client";
import React from "react";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { useGuests } from "../../../context/GuestContext";
import { Slider } from "@/components/ui/slider";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import GuestEditModal from "@/components/GuestEditModal";

function AdminView() {
  const id = useParams().id;
  const { guests } = useGuests();

  const guest = guests.find((g) => g.bonvoy_id === id);

  const preferences = guest?.preferences;

  if (!guest) {
    return <div>Guest not found</div>;
  }

  const satisfactionClass = () => {
    if (guest.satisfaction >= 85) return "text-green-700";
    if (guest.satisfaction >= 50) return "text-yellow-500";
    if (guest.satisfaction >= 30) return "text-orange-500";
    return "text-red-500";
  };

  const loyaltyClass = () => {
    if (guest.loyalty >= 85) return "text-green-700";
    if (guest.loyalty >= 50) return "text-yellow-500";
    if (guest.loyalty >= 30) return "text-orange-500";
    return "text-red-500";
  };
  const categories = [
    {
      title: "Accessibility",
      items: preferences?.accessible ? [preferences.accessible] : [],
    },
    {
      title: "Bed",
      items: preferences?.bed_type ? [preferences.bed_type] : [],
    },
    {
      title: "Room",
      items: [
        preferences?.room?.type,
        ...(preferences?.room?.location || []),
        preferences?.room?.temperature,
      ].filter(Boolean) as string[],
    },
    { title: "Pillows", items: preferences?.pillow_type || [] },
    {
      title: "Priority",
      items: preferences?.prompt_priority ? [preferences.prompt_priority] : [],
    },
    { title: "Amenities", items: preferences?.amenities || [] },
    {
      title: "Favorite Foods",
      items: preferences?.food_preferences?.favorites || [],
    },
    {
      title: "Dietary Restrictions",
      items: preferences?.food_preferences?.dietary_restrictions || [],
    },
    {
      title: "Non-Alcoholic Beverages",
      items: preferences?.beverages?.non_alcoholic || [],
    },
    {
      title: "Alcoholic Beverages",
      items: preferences?.beverages?.alcoholic || [],
    },
  ];

  const snakeCaseToNormalCase = (str: string): string => {
    return str
      .split("_")
      .map((word) => word.toLowerCase())
      .join(" ");
  };

  const formatBookingHistory = (bookings: any) => {
    return bookings.map((booking: any) => ({
      date: booking.checkInDate,
      count: 1,
    }));
  };

  const earliestBookingYear = Math.min(
    ...guest.past_bookings.map((booking: any) =>
      new Date(booking.checkInDate).getFullYear()
    )
  );
  const earliestBookingDate = new Date(earliestBookingYear, 0, 1);

  return (
    <div>
      <GuestEditModal 
        guest={guest}
      />
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-4 items-stretch justify-between">
            <div className="flex flex-col gap-4 h-full items-stretch">
                <h1 className="text-3xl font-bold mb-4">
                    {guest.first_name} {guest.last_name}
                </h1>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                    <span className="font-bold">Bonvoy Number:</span>
                    <span>{id}</span>
                    </div>

                    <div className="flex items-center gap-3">
                    <span className="font-bold">Gender:</span>
                    <span>Male</span>
                    </div>

                    <div className="flex items-center gap-3">
                    <span className="font-bold">Birthday:</span>
                    <span>1990-01-01</span>
                    </div>
                </div>

                <div className="mt-14">
                    <div className="font-black text-6xl">
                    <div className="flex items-center gap-4 mb-2">
                        {guest.satisfaction}
                        <span className="font-bold text-sm">Satisfaction Score</span>
                    </div>

                    <Slider max={100} value={[guest.satisfaction]} disabled></Slider>
                    </div>
                </div>
            </div>

          <div className="mt-10">
            <div className="text-2xl font-bold mb-3">Upcoming Bookings</div>
            {guest.upcoming_bookings.map((booking, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg mb-2 flex items-center justify-between"
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
        </div>

        <div>
          <div className="text-2xl font-bold">Preferences</div>
          <div className="mt-6 w-full">
            <div className="flex flex-col items-stretch">
              <div className="border p-4 rounded-lg h-full mb-2 ">
                <div className="text-xl font-bold">Room</div>

                <div className="flex items-center gap-2 my-3">
                  {preferences?.room?.location && (
                    <>
                      <span className="font-bold">Location: </span>
                      <div className="px-2 py-1 bg-neutral-200 rounded-full">
                        {preferences.room.location
                          .map(snakeCaseToNormalCase)
                          .join(", ")}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 my-3">
                  {preferences?.room?.temperature && (
                    <>
                      <span className="font-semibold">Temperature: </span>
                      <div className="px-2 py-1 bg-neutral-200 rounded-full">
                        {preferences.room.temperature} F°
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 my-3">
                  {preferences?.room?.type && (
                    <>
                      <span className="font-semibold">Smoking:</span>
                      <div className="px-2 py-1 bg-neutral-200 rounded-full">
                        {snakeCaseToNormalCase(preferences.room.type)}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 my-3">
                  {preferences?.bed_type && (
                    <>
                      <span className="font-semibold">Bed:</span>
                      <div className="px-2 py-1 bg-neutral-200 rounded-full">
                        {snakeCaseToNormalCase(preferences.bed_type)}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 my-3">
                  {preferences?.pillow_type && (
                    <>
                      <span className="font-semibold">Pillow Type:</span>
                      <div className="px-2 py-1 bg-neutral-200 rounded-full">
                        {Array.isArray(preferences.pillow_type)
                          ? preferences.pillow_type
                              .map(snakeCaseToNormalCase)
                              .join(", ")
                          : snakeCaseToNormalCase(preferences.pillow_type)}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-cetner gap-2 my-3">
                  {preferences?.amenities && (
                    <>
                      <span className="font-semibold">Amenities: </span>

                      <div className="px-2 py-1 bg-neutral-200 rounded-full">
                        {preferences.amenities
                          .map(snakeCaseToNormalCase)
                          .join(", ")}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="border p-4 rounded-lg h-full mb-2 ">
                <div className="text-xl font-bold">Beverages</div>

                <div className="flex items-center gap-2 my-3">
                  {preferences?.beverages?.non_alcoholic && (
                    <>
                      <span className="font-semibold">Non Alcoholic: </span>

                      <div className="px-2 py-1 bg-neutral-200 rounded-full">
                        {preferences.beverages.non_alcoholic
                          .map(snakeCaseToNormalCase)
                          .join(", ")}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 my-3">
                  {preferences?.beverages?.alcoholic && (
                    <>
                      <span className="font-semibold">Alcoholic: </span>

                      <div className="px-2 py-1 bg-neutral-200 rounded-full">
                        {preferences.beverages.alcoholic
                          .map(snakeCaseToNormalCase)
                          .join(", ")}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="border p-4 rounded-lg h-full mb-2 ">
                <div className="text-xl font-bold">Food</div>

                <div className="flex items-center gap-2 my-3">
                  {preferences?.room?.location && (
                    <>
                      <span className="font-semibold">Favorites: </span>
                      <div className="px-2 py-1 bg-neutral-200 rounded-full">
                        {preferences.food_preferences.favorites
                          .map(snakeCaseToNormalCase)
                          .join(", ")}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 my-3">
                  <span className="font-semibold">Dietary Restrictions: </span>
                  {preferences?.food_preferences?.dietary_restrictions && (
                    <div className="px-2 py-1 bg-neutral-200 rounded-full">
                      {preferences.food_preferences.dietary_restrictions.map(snakeCaseToNormalCase).join(", ")}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 my-3">
                  <span className="font-semibold">Smoking:</span>
                  {preferences?.room?.type && (
                    <div className="px-2 py-1 bg-neutral-200 rounded-full">
                      {snakeCaseToNormalCase(preferences.room.type)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="text-2xl font-semibold mb-4">Booking History</div>
        <CalendarHeatmap
          startDate={earliestBookingDate}
          values={formatBookingHistory(guest.past_bookings)}
          classForValue={(value) => {
            if (!value) {
              return 'color-empty';
            }
            return `color-scale-${value.count}`;
          }}
        />
      </div>
      <div className="mt-10">
        <div className="text-2xl font-bold">Past Bookings</div>
        {guest.past_bookings.map((booking, index) => (
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
    </div>
  );
}

export default AdminView;
