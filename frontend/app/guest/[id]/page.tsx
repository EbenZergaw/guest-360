"use client"
import React from 'react'
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import {useGuests} from '../../../context/GuestContext';


function GuestProfile() {
    const id = useParams().id;
    const {guests} = useGuests();

  const guest = guests.find(g => g.id === id);

  if (!guest) {
    return <div>Guest not found</div>;
  }

  const satisfactionClass = () => {
    if (guest.satisfaction >= 85) return 'text-green-700';
    if (guest.satisfaction >= 50) return 'text-yellow-500';
    if (guest.satisfaction >= 30) return 'text-orange-500';
    return 'text-red-500';
  };

  const loyaltyClass = () => {
    if (guest.loyalty >= 85) return 'text-green-700';
    if (guest.loyalty >= 50) return 'text-yellow-500';
    if (guest.loyalty >= 30) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{guest.name}</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Last Booking:</p>
          <p>{guest.lastBooking}</p>
        </div>
        <div>
          <p className="font-semibold">Satisfaction:</p>
          <p className={`font-bold ${satisfactionClass()}`}>{guest.satisfaction}</p>
        </div>
        <div>
          <p className="font-semibold">Loyalty:</p>
          <p className={`font-bold ${loyaltyClass()}`}>{guest.loyalty}</p>
        </div>
      </div>
    </div>
  )
}

export default GuestProfile
