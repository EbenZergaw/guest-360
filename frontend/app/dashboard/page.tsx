"use client";
import React from "react";
import GuestRow from "@/components/GuestRow";
import { useGuests } from "@/context/GuestContext";
import { useUser } from "@clerk/nextjs";

function page() {
  const { guests } = useGuests();
  const { user } = useUser();

  return (
    <div>
      <h1 className="text-3xl font-bold">Guest Dashboard</h1>

      <div className="w-full mx-auto">
        <div className={`grid ${user?.username == "room-service" ? "grid-cols-3" : "grid-cols-4"} items-center rounded-lg p-4 my-4`}>
          <div className="font-bold">Name</div>
          {user?.username != "room-service" && <div>Next Booking</div>}
          <div>Satisfaction</div>
        </div>

        {guests.map((guest) => (
          <GuestRow guest={guest} />
        ))}
      </div>
    </div>
  );
}

export default page;
