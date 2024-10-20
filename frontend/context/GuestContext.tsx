import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of a booking
export interface Booking {
  city: string;
  hotel: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfRooms: string;
  numberOfGuests: string;
}

// Define the shape of guest preferences
export interface Preferences {
  accessible: string;
  bed_type: string;
  room: {
    type: string;
    location: string[];
    temperature: string;
  };
  pillow_type: string[];
  prompt_priority: string;
  amenities: string[];
  food_preferences: {
    favorites: string[];
    dietary_restrictions: string[];
  };
  beverages: {
    non_alcoholic: string[];
    alcoholic: string[];
  };
}

// Define the shape of a guest
export interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  birthday: string;
  gender: string;
  bonvoy_id: string;  // UUID format
  email: string;
  phone_number: string;
  upcoming_bookings: Booking[];
  past_bookings: Booking[];
  preferences: Preferences;
  lastBooking: string;
  satisfaction: number;
  loyalty: number;
}

// Define the shape of the context
interface GuestsContextType {
  guests: Guest[];
  addGuest: (guest: Guest) => void;
  updateGuest: (guest: Guest) => void;
  removeGuest: (id: string) => void;
}

// Create the context with default values
const GuestsContext = createContext<GuestsContextType>({
  guests: [],
  addGuest: () => {},
  updateGuest: () => {},
  removeGuest: () => {},
});

// Create a provider component
export const GuestsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [guests, setGuests] = useState<Guest[]>(() => {
    // Try to get guests from localStorage on initial load
    const storedGuests = localStorage.getItem('guests');
    return storedGuests ? JSON.parse(storedGuests) : [
      {
        id: "g1",
        first_name: "John",
        last_name: "Smith",
        birthday: "1990-05-20",
        gender: "male",
        bonvoy_id: "123e4567-e89b-12d3-a456-426614174000",
        email: "johnsmith@example.com",
        phone_number: "+1234567890",
        upcoming_bookings: [
          {
            city: "New York",
            hotel: "Marriott Downtown",
            checkInDate: "2024-05-10",
            checkOutDate: "2024-05-15",
            numberOfRooms: "1",
            numberOfGuests: "2",
          },
          {
            city: "Los Angeles",
            hotel: "Ritz Carlton",
            checkInDate: "2024-06-01",
            checkOutDate: "2024-06-05",
            numberOfRooms: "2",
            numberOfGuests: "4",
          }
        ],
        past_bookings: [
          {
            city: "Miami",
            hotel: "Marriott Beachfront",
            checkInDate: "2023-07-20",
            checkOutDate: "2023-07-25",
            numberOfRooms: "1",
            numberOfGuests: "2",
          },
          {
            city: "Chicago",
            hotel: "Marriott City Center",
            checkInDate: "2023-08-15",
            checkOutDate: "2023-08-20",
            numberOfRooms: "1",
            numberOfGuests: "1",
          }
        ],
        preferences: {
          accessible: "true",
          bed_type: "king",
          room: {
            type: "non_smoking",
            location: ["high_floor"],
            temperature: "72",
          },
          pillow_type: ["foam"],
          prompt_priority: "room_type",
          amenities: ["extra_towels"],
          food_preferences: {
            favorites: ["pizza"],
            dietary_restrictions: ["gluten_free"],
          },
          beverages: {
            non_alcoholic: ["juice"],
            alcoholic: ["vodka"],
          },
        },
        lastBooking: "2023-12-15",
        satisfaction: 30,
        loyalty: 92,
      },
      {
        id: "g2",
        first_name: "Emily",
        last_name: "Johnson",
        birthday: "1985-11-02",
        gender: "female",
        bonvoy_id: "987e6543-e89b-12d3-a456-426614174000",
        email: "emilyjohnson@example.com",
        phone_number: "+0987654321",
        upcoming_bookings: [
          {
            city: "San Francisco",
            hotel: "Marriott Marquis",
            checkInDate: "2024-03-10",
            checkOutDate: "2024-03-14",
            numberOfRooms: "1",
            numberOfGuests: "2",
          }
        ],
        past_bookings: [
          {
            city: "Boston",
            hotel: "Marriott Back Bay",
            checkInDate: "2023-11-05",
            checkOutDate: "2023-11-10",
            numberOfRooms: "1",
            numberOfGuests: "2",
          }
        ],
        preferences: {
          accessible: "false",
          bed_type: "double",
          room: {
            type: "smoking",
            location: ["low_floor"],
            temperature: "70",
          },
          pillow_type: ["extra_feather"],
          prompt_priority: "bed_type",
          amenities: ["refrigerator"],
          food_preferences: {
            favorites: ["fruits"],
            dietary_restrictions: ["no_pork"],
          },
          beverages: {
            non_alcoholic: ["tea"],
            alcoholic: ["red_wine"],
          },
        },
        lastBooking: "2024-01-03",
        satisfaction: 45,
        loyalty: 78,
      }
    ];
  });

  // Update localStorage whenever guests state changes
  useEffect(() => {
    localStorage.setItem('guests', JSON.stringify(guests));
  }, [guests]);

  // Function to add a guest
  const addGuest = (guest: Guest) => {
    setGuests(prevGuests => {
      const newGuests = [...prevGuests, guest];
      localStorage.setItem('guests', JSON.stringify(newGuests));
      return newGuests;
    });
  };

  // Function to update a guest
  const updateGuest = (updatedGuest: Guest) => {
    setGuests(prevGuests => {
      const newGuests = prevGuests.map(guest => 
        guest.id === updatedGuest.id ? updatedGuest : guest
      );
      localStorage.setItem('guests', JSON.stringify(newGuests));
      return newGuests;
    });
  };

  // Function to remove a guest
  const removeGuest = (id: string) => {
    setGuests(prevGuests => {
      const newGuests = prevGuests.filter(guest => guest.id !== id);
      localStorage.setItem('guests', JSON.stringify(newGuests));
      return newGuests;
    });
  };

  return (
    <GuestsContext.Provider value={{ guests, addGuest, updateGuest, removeGuest }}>
      {children}
    </GuestsContext.Provider>
  );
};

// Custom hook to use the guests state
export const useGuests = () => useContext(GuestsContext);
