import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of a guest
interface Guest {
id: string;
  name: string;
  lastBooking: string;
  satisfaction: number;
  loyalty: number;
}

// Define the shape of the context
interface GuestsContextType {
  guests: Guest[];
  addGuest: (guest: Guest) => void;
  updateGuest: (guest: Guest) => void;
  removeGuest: (name: string) => void;
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
  const [guests, setGuests] = useState<Guest[]>([
    {
        id: "g1",
        name: "John Smith",
        lastBooking: "2023-12-15",
        satisfaction: 87,
        loyalty: 92,
      },
      {
        id: "g2",
        name: "Emily Johnson",
        lastBooking: "2024-01-03",
        satisfaction: 45,
        loyalty: 78,
      },
      {
        id: "g3",
        name: "Michael Brown",
        lastBooking: "2023-11-28",
        satisfaction: 63,
        loyalty: 31,
      },
      {
        id: "g4",
        name: "Sarah Davis",
        lastBooking: "2024-01-10",
        satisfaction: 19,
        loyalty: 55,
      },
      {
        id: "g5",
        name: "Robert Wilson",
        lastBooking: "2023-12-22",
        satisfaction: 94,
        loyalty: 7,
      },
      {
        id: "g6",
        name: "Jennifer Lee",
        lastBooking: "2024-01-05",
        satisfaction: 72,
        loyalty: 89,
      },
  ]);

  // Function to add a guest
  const addGuest = (guest: Guest) => {
    setGuests(prevGuests => [...prevGuests, guest]);
  };

  // Function to update a guest
  const updateGuest = (updatedGuest: Guest) => {
    setGuests(prevGuests =>
      prevGuests.map(guest => (guest.name === updatedGuest.name ? updatedGuest : guest))
    );
  };

  // Function to remove a guest
  const removeGuest = (name: string) => {
    setGuests(prevGuests => prevGuests.filter(guest => guest.name !== name));
  };

  return (
    <GuestsContext.Provider value={{ guests, addGuest, updateGuest, removeGuest }}>
      {children}
    </GuestsContext.Provider>
  );
};

// Custom hook to use the guests state
export const useGuests = () => useContext(GuestsContext);
