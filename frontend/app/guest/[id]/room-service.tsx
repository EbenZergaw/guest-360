"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useGuests } from "../../../context/GuestContext";
import { Slider } from "@/components/ui/slider";
import "react-calendar-heatmap/dist/styles.css";
import Preferences from "@/components/profile/Preferences";

function RoomServiceView() {
  const id = useParams().id;
  const { guests } = useGuests();

  const guest = guests.find((g) => g.bonvoy_id === id);

  const preferences = guest?.preferences;

  if (!guest) {
    return <div>Guest not found</div>;
  }
  const snakeCaseToNormalCase = (str: string): string => {
    return str
      .split("_")
      .map((word) => word.toLowerCase())
      .join(" ");
  };


  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-4 items-stretch justify-between">
            <div className="flex flex-col gap-4 h-full items-stretch">
                <h1 className="text-3xl font-bold mb-4">
                    {guest.first_name} {guest.last_name}
                </h1>

                <div className="flex flex-col gap-3">

                    <div className="flex items-center gap-3">
                    <span className="font-bold">Gender:</span>
                    <span>Male</span>
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
        </div>

        <div>
            <Preferences 
                preferences={preferences}
            />
        </div>
      </div>

    </div>
  );
}

export default RoomServiceView;
