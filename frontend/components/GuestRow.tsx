import Link from 'next/link';
import React from 'react';

function GuestRow({ guest }: { guest: any }) {
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

    const loyaltyClass = () => {
        // Optionally, you can apply a similar color logic for loyalty
        if (guest.loyalty >= 85) {
            return 'text-green-700';
        } else if (guest.loyalty >= 50) {
            return 'text-yellow-500';
        } else if (guest.loyalty >= 30) {
            return 'text-orange-500';
        } else {
            return 'text-red-500';
        }
    };

    return (
        <Link href={`/guest/${guest.id}`} className='grid grid-cols-4 items-center w-full border border-slate-700 rounded-lg p-4 my-4 hover:bg-gray-100'>
            <div className=''>
                {guest.name}
            </div>
            <div className=''>
                {guest.lastBooking}
            </div>
            <div className={`font-black text-xl ${satisfactionClass()}`}>
                {guest.satisfaction}
            </div>
            <div className={`font-black text-xl ${loyaltyClass()}`}>
                {guest.loyalty}
            </div>
        </Link>
    );
}

export default GuestRow;
