"use client"
import RadarPreview from "../components/RadarPreview";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GlobeDisplay } from "@/components/GlobeDisplay";

export default function Home() {

  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  return (
    <div className="mt-20">
      <div className="w-fit mx-auto">
        <GlobeDisplay></GlobeDisplay>
      </div>

      <div className="mt-60"></div>

      <h2 className="text-2xl font-bold w-fit mx-auto mb-12">Have a 360 View of Your Guests</h2>
      <div className="grid grid-cols-3 gap-2 mb-20">
        <div className="p-4 border rounded">
          <h2 className="text-xl w-fit text-center mx-auto font-bold">Structure Your Customer Data</h2>
        </div>
        <div className="p-4 border rounded shadow border-orange-600">
          <h2 className="text-2xl bg-gradient-to-t from-orange-600 to-yellow-400 bg-clip-text text-transparent w-fit text-center mx-auto font-bold">Build Brand Loyalty</h2>
        </div>
        <div className="p-4 border rounded">
          <h2 className="text-xl w-fit text-center mx-auto font-bold ">Increase Revenue</h2>
        </div>
      </div>

      <div className="flex flex-col">
        <h2 className="text-center text-3xl font-bold">Get A Radar on Your Guests Preferences</h2>
        <RadarPreview></RadarPreview>
      </div>
     
    </div>
  );
}
