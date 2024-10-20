"use client"
import Link from 'next/link';
import React from 'react';
import { GoLinkExternal } from "react-icons/go";
import { useUser } from "@clerk/nextjs";

function GuestRow({ guest }: { guest: any }) {

    const { user } = useUser();

    const satisfactionClass = () => {
        // Classes based on satisfaction; 100 is green, 0 is red.
        if (guest.satisfaction >= 85) {
            return 'text-green-700';
        } else if (guest.satisfaction >= 50) {
            return 'text-yellow-500';
        } else if (guest.satisfaction >= 30) {
            return 'text-orange-500';
        } else {
            return 'text-red-500';
        }
    };

    const countHowManyDaysFromUpcomingBooking = () => {
        const today = new Date();
        const upcomingBookingDate = new Date(guest.upcoming_bookings[0].checkInDate);
        const diffTime = Math.abs(upcomingBookingDate.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays;
    }

    const nextBooking = () => {
        // if there is an upcoming booking, return the days from today, else return "No upcoming booking"
        if (guest.upcoming_bookings.length > 0) {
            return countHowManyDaysFromUpcomingBooking() + " days";
        } else {
            return "No upcoming booking";
        }
    }

    return (
        <Link href={`/guest/${guest.bonvoy_id}`} className={`grid ${user?.username == "room-service" ? "grid-cols-3" : "grid-cols-4"} items-center w-full border border-slate-700 rounded-lg p-4 my-4 hover:bg-gray-100`}>
            <div className=''>
                {guest.first_name} {guest.last_name}
            </div>
            {
                user?.username != "room-service" && (
                    <div className='font-semibold'>
                        {nextBooking()}
                    </div>
                )
            }
            <div className={`font-black text-xl ${satisfactionClass()}`}>
                {guest.satisfaction}
            </div>
            

            <div className="flex justify-end">
                <GoLinkExternal className="relative right-4 text-xl" />
            </div>
        </Link>
    );
}

export default GuestRow;
