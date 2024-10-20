"use client";
import React from "react";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { useGuests } from "../../../context/GuestContext";
import { Slider } from "@/components/ui/slider";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

function GuestProfile() {
  const id = useParams().id;
  const { guests } = useGuests();

  const guest = guests.find((g) => g.id === id);

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

  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-4">
            {guest.first_name} {guest.last_name}
          </h1>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="font-bold">Bonvoy Number:</span>
              <span>BONVOY NUMBER OVER HERE</span>
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

          <div className="mt-4">
            <div className="font-black text-6xl">
              <div className="flex items-center gap-4 mb-2">
                {guest.satisfaction}
                <span className="font-bold text-sm">Satisfaction Score</span>
              </div>

              <Slider max={100} value={[guest.satisfaction]} disabled></Slider>
            </div>
          </div>

          <div className="mt-20">
            <div className="text-2xl font-bold">Preferences</div>

            <div>
              <div>
                <div className="text-lg font-bold">Room</div>

                <div className="flex items-center gap-2 my-3">
                  <span className="font-bold">Location: </span>
                  {preferences?.room?.location && (
                    <div className="px-2 py-1 bg-neutral-200 rounded-full">
                      {preferences.room.location
                        .map(snakeCaseToNormalCase)
                        .join(", ")}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 my-3">
                  <span className="font-bold">Temperature: </span>
                  {preferences?.room?.temperature && (
                    <div className="px-2 py-1 bg-neutral-200 rounded-full">
                      {preferences.room.temperature}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 my-3">
                  <span className="font-bold">Smoking:</span>
                  {preferences?.room?.type && (
                    <div className="px-2 py-1 bg-neutral-200 rounded-full">
                      {snakeCaseToNormalCase(preferences.room.type)}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 my-3">
                  <span className="font-bold">Bed:</span>
                  {preferences?.bed_type && (
                    <div className="px-2 py-1 bg-neutral-200 rounded-full">
                      {snakeCaseToNormalCase(preferences.bed_type)}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 my-3">
                  <span className="font-bold">Pillow Type:</span>
                  {preferences?.pillow_type && (
                    <div className="px-2 py-1 bg-neutral-200 rounded-full">
                      {Array.isArray(preferences.pillow_type)
                        ? preferences.pillow_type.map(snakeCaseToNormalCase).join(", ")
                        : snakeCaseToNormalCase(preferences.pillow_type)}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="text-lg font-bold">Room Preferences</div>

                <div className="flex items-center gap-2 my-3">
                  <span className="font-bold">Location: </span>
                  {preferences?.room?.location && (
                    <div className="px-2 py-1 bg-neutral-200 rounded-full">
                      {preferences.room.location
                        .map(snakeCaseToNormalCase)
                        .join(", ")}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 my-3">
                  <span className="font-bold">Temperature: </span>
                  {preferences?.room?.temperature && (
                    <div className="px-2 py-1 bg-neutral-200 rounded-full">
                      {preferences.room.temperature}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 my-3">
                  <span className="font-bold">Smoking:</span>
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
        <div>
          <div className="text-2xl font-bold mb-4">Booking History</div>
          <CalendarHeatmap values={[]} />
        </div>
      </div>
    </div>
  );
}

export default GuestProfile;
