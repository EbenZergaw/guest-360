'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Guest, useGuests } from '@/context/GuestContext'

interface GuestEditModalProps {
  guest: Guest
}

export default function GuestEditModal({ guest: initialGuest }: GuestEditModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [guest, setGuest] = useState<Guest>(initialGuest)
  const { updateGuest } = useGuests()

  useEffect(() => {
    setGuest(initialGuest)
  }, [initialGuest])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setGuest({ ...guest, [field]: e.target.value })
  }

  const handlePreferenceChange = (value: string, field: string) => {
    setGuest((prevGuest) => {
      switch (field) {
        case 'room_temperature':
          return {
            ...prevGuest,
            preferences: {
              ...prevGuest.preferences,
              room: {
                ...prevGuest.preferences.room,
                temperature: value,
              },
            },
          };
        case 'room_type':
          return {
            ...prevGuest,
            preferences: {
              ...prevGuest.preferences,
              room: {
                ...prevGuest.preferences.room,
                type: value,
              },
            },
          };
        case 'bed_type':
          return {
            ...prevGuest,
            preferences: {
              ...prevGuest.preferences,
              bed_type: value,
            },
          };
        case 'accessible':
          return {
            ...prevGuest,
            preferences: {
              ...prevGuest.preferences,
              accessible: value,
            },
          };
        default:
          return {
            ...prevGuest,
            preferences: {
              ...prevGuest.preferences,
              [field]: value,
            },
          };
      }
    });
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value.split(',').map(item => item.trim())
    setGuest((prevGuest) => {
      switch (field) {
        case 'room_location':
          return {
            ...prevGuest,
            preferences: {
              ...prevGuest.preferences,
              room: {
                ...prevGuest.preferences.room,
                location: value,
              },
            },
          };
        case 'dietary_restrictions':
          return {
            ...prevGuest,
            preferences: {
              ...prevGuest.preferences,
              food_preferences: {
                ...prevGuest.preferences.food_preferences,
                dietary_restrictions: value,
              },
            },
          };
        case 'favorite_foods':
          return {
            ...prevGuest,
            preferences: {
              ...prevGuest.preferences,
              food_preferences: {
                ...prevGuest.preferences.food_preferences,
                favorites: value,
              },
            },
          };
        case 'non_alcoholic_beverages':
          return {
            ...prevGuest,
            preferences: {
              ...prevGuest.preferences,
              beverages: {
                ...prevGuest.preferences.beverages,
                non_alcoholic: value,
              },
            },
          };
        case 'alcoholic_beverages':
          return {
            ...prevGuest,
            preferences: {
              ...prevGuest.preferences,
              beverages: {
                ...prevGuest.preferences.beverages,
                alcoholic: value,
              },
            },
          };
        default:
          return {
            ...prevGuest,
            preferences: {
              ...prevGuest.preferences,
              [field]: value,
            },
          };
      }
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateGuest(guest)
    console.log('Guest updated:', guest)
    setIsOpen(false)
  }

  return (
    <div className=''>
      <Button 
        variant="outline" 
        className='border w-full mb-3 border-orange-300 bg-gradient-to-t from-amber-500 to-amber-300 rounded text-gray-800' 
        onClick={() => setIsOpen(true)}
      >
        Edit Guest
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit Guest Information
              </h3>
              <div
                className='text-gray-800'
                onClick={() => setIsOpen(false)}
              >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-4 md:p-5">
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">First Name</Label>
                  <Input
                    type="text"
                    id="first_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={guest.first_name}
                    onChange={(e) => handleInputChange(e, 'first_name')}
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900">Last Name</Label>
                  <Input
                    type="text"
                    id="last_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={guest.last_name}
                    onChange={(e) => handleInputChange(e, 'last_name')}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={guest.email}
                    onChange={(e) => handleInputChange(e, 'email')}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="phone_number" className="block mb-2 text-sm font-medium text-gray-900">Phone Number</Label>
                  <Input
                    type="tel"
                    id="phone_number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={guest.phone_number}
                    onChange={(e) => handleInputChange(e, 'phone_number')}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="accessible" className="block mb-2 text-sm font-medium text-gray-900">Accessible</Label>
                  <Select onValueChange={(value) => handlePreferenceChange(value, 'accessible')} value={guest.preferences.accessible}>
                    <SelectTrigger className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                      <SelectValue placeholder="Select accessibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Add more preference fields here */}
                <div className="col-span-2">
                  <Label htmlFor="lastBooking" className="block mb-2 text-sm font-medium text-gray-900">Last Booking</Label>
                  <Input
                    type="date"
                    id="lastBooking"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={guest.lastBooking}
                    onChange={(e) => handleInputChange(e, 'lastBooking')}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="satisfaction" className="block mb-2 text-sm font-medium text-gray-900">Satisfaction (0-100)</Label>
                  <Input
                    type="number"
                    id="satisfaction"
                    min="0"
                    max="100"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={guest.satisfaction}
                    onChange={(e) => handleInputChange(e, 'satisfaction')}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="loyalty" className="block mb-2 text-sm font-medium text-gray-900">Loyalty (0-100)</Label>
                  <Input
                    type="number"
                    id="loyalty"
                    min="0"
                    max="100"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={guest.loyalty}
                    onChange={(e) => handleInputChange(e, 'loyalty')}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="room_type" className="block mb-2 text-sm font-medium text-gray-900">Room Type</Label>
                  <Select onValueChange={(value) => handlePreferenceChange(value, 'room_type')} value={guest.preferences.room.type}>
                    <SelectTrigger className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="dietary_restrictions" className="block mb-2 text-sm font-medium text-gray-900">Dietary Restrictions</Label>
                  <Input
                    type="text"
                    id="dietary_restrictions"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={guest.preferences.food_preferences.dietary_restrictions?.join(', ') || ''}
                    onChange={(e) => handleArrayInputChange(e, 'dietary_restrictions')}
                    placeholder="Enter dietary restrictions, separated by commas"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="bed_type" className="block mb-2 text-sm font-medium text-gray-900">Bed Type</Label>
                  <Select onValueChange={(value) => handlePreferenceChange(value, 'bed_type')} value={guest.preferences.bed_type}>
                    <SelectTrigger className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                      <SelectValue placeholder="Select bed type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="queen">Queen</SelectItem>
                      <SelectItem value="king">King</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="room_location" className="block mb-2 text-sm font-medium text-gray-900">Room Location</Label>
                  <Input
                    type="text"
                    id="room_location"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={guest.preferences.room.location.join(', ')}
                    onChange={(e) => handleArrayInputChange(e, 'room_location')}
                    placeholder="Enter preferred room locations, separated by commas"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="room_temperature" className="block mb-2 text-sm font-medium text-gray-900">Room Temperature</Label>
                  <Input
                    type="text"
                    id="room_temperature"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={guest.preferences.room.temperature}
                    onChange={(e) => handlePreferenceChange(e.target.value, 'room_temperature')}
                    placeholder="Enter preferred room temperature"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="pillow_type" className="block mb-2 text-sm font-medium text-gray-900">Pillow Type</Label>
                  <Input
                    type="text"
                    id="pillow_type"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={guest.preferences.pillow_type.join(', ')}
                    onChange={(e) => handleArrayInputChange(e, 'pillow_type')}
                    placeholder="Enter preferred pillow types, separated by commas"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="amenities" className="block mb-2 text-sm font-medium text-gray-900">Amenities</Label>
                  <Input
                    type="text"
                    id="amenities"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={guest.preferences.amenities.join(', ')}
                    onChange={(e) => handleArrayInputChange(e, 'amenities')}
                    placeholder="Enter preferred amenities, separated by commas"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="favorite_foods" className="block mb-2 text-sm font-medium text-gray-900">Favorite Foods</Label>
                  <Input
                    type="text"
                    id="favorite_foods"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={guest.preferences.food_preferences.favorites.join(', ')}
                    onChange={(e) => handleArrayInputChange(e, 'favorite_foods')}
                    placeholder="Enter favorite foods, separated by commas"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="non_alcoholic_beverages" className="block mb-2 text-sm font-medium text-gray-900">Non-Alcoholic Beverages</Label>
                  <Input
                    type="text"
                    id="non_alcoholic_beverages"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={guest.preferences.beverages.non_alcoholic.join(', ')}
                    onChange={(e) => handleArrayInputChange(e, 'non_alcoholic_beverages')}
                    placeholder="Enter preferred non-alcoholic beverages, separated by commas"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="alcoholic_beverages" className="block mb-2 text-sm font-medium text-gray-900">Alcoholic Beverages</Label>
                  <Input
                    type="text"
                    id="alcoholic_beverages"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={guest.preferences.beverages.alcoholic.join(', ')}
                    onChange={(e) => handleArrayInputChange(e, 'alcoholic_beverages')}
                    placeholder="Enter preferred alcoholic beverages, separated by commas"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  type="submit" 
                  variant="outline" 
                  className='border border-orange-300 bg-gradient-to-t from-amber-500 to-amber-300 rounded text-gray-800'
                >
                  Save Changes
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className='border rounded text-gray-800'
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
