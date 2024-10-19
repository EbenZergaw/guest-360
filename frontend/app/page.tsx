"use client"
import RadarPreview from "../components/RadarPreview";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  return (
    <div className="">
      <h1 className="text-3xl font-bold w-1/2">A Full 360 View of Your Guests</h1>
      <p className="text-lg">
        Guest-360 is a platform that allows you to get a full understanding of your guests preferences.
        From food to room preferences, we got you covered.
      </p>
      <br />


      <br />

      <div className="flex flex-col">
        <h2 className="text-center text-3xl font-bold">Get A Radar on Your Guests Preferences</h2>
        <RadarPreview></RadarPreview>
      </div>
     
    </div>
  );
}
