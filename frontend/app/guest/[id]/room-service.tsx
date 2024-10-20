"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useGuests } from "../../../context/GuestContext";
import { Slider } from "@/components/ui/slider";
import "react-calendar-heatmap/dist/styles.css";

function RoomServiceView() {
  const id = useParams().id;
  const { guests } = useGuests();

  const guest = guests.find((g) => g.id === id);

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

    </div>
  );
}

export default RoomServiceView;
