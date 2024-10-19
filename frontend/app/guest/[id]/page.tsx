"use client";
import React from "react";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { useGuests } from "../../../context/GuestContext";
import { Slider } from "@/components/ui/slider";

function GuestProfile() {
  const id = useParams().id;
  const { guests } = useGuests();

  const guest = guests.find((g) => g.id === id);

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

  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-4">{guest.name}</h1>

          <div className="flex flex-col gap-4">
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
        </div>

        <div>
            <div className="text-2xl font-bold mb-4">Booking History</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">

      </div>
    </div>
  );
}

export default GuestProfile;
