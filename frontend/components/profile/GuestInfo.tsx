"use client";
import { Slider } from "@/components/ui/slider";
import { Guest } from "@/context/GuestContext";

import { useUser } from "@clerk/nextjs";

interface GuestInfoProps {
  guest: Guest;
}

export function GuestInfo({ guest }: GuestInfoProps) {
  const { user } = useUser();

  return (
    <div className="flex flex-col gap-4 h-full items-stretch">
      <h1 className="text-3xl font-bold mb-4">
        {guest.first_name} {guest.last_name}
      </h1>
      {user?.username != "room-service" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="font-bold">Bonvoy Number:</span>
            <span>{guest.bonvoy_id}</span>
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
      )}

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
  );
}
