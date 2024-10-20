"use client";
import React from "react";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { useGuests } from "../../../context/GuestContext";
import { Slider } from "@/components/ui/slider";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useUser } from "@clerk/nextjs";
import AdminView from "./admin-view";
import FrontDeskView from "./front-desk-view";
import Link from "next/link";
import RoomServiceView from "./room-service";

function GuestProfile() {
  const { user } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  if (user.username == "admin") {
    return (
      <>
        <Link className="underline mb-20" href="/dashboard">
          Back to Dashboard
        </Link>
        <br />
        <br />
        <AdminView />
      </>
    );
  } else if ((user.username = "front-desk")) {
    return (
      <>
        <Link className="underline pb-20" href="/dashboard">
          Back to Dashboard
        </Link>
        <br />
        <br />
        <FrontDeskView />
      </>
    );
  } else if (user.username == "room-service") {
    return (
      <>
        <Link className="underline pb-20" href="/dashboard">
          Back to Dashboard
        </Link>
        <br />
        <br />
        <RoomService />
      </>
    );
  }
}

export default GuestProfile;
