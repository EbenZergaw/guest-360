'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Guest } from '@/context/GuestContext'
import { useGuests } from '@/context/GuestContext'
import { v4 as uuidv4 } from 'uuid';

export default function GuestModalForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [guest, setGuest] = useState<Guest>({
    id: '',
    first_name: '',
    last_name: '',
    birthday: '',
    gender: '',
    bonvoy_id: uuidv4(),
    email: '',
    phone_number: '',
    upcoming_bookings: [],
    past_bookings: [],
    preferences: {
      accessible: '',
      bed_type: '',
      room: {
        type: '',
        location: [],
        temperature: '',
      },
      pillow_type: [],
      prompt_priority: '',
      amenities: [],
      food_preferences: {
        favorites: [],
        dietary_restrictions: [],
      },
      beverages: {
        non_alcoholic: [],
        alcoholic: [],
      },
    },
    lastBooking: '',
    satisfaction: 0,
    loyalty: 0,
  })

  const { addGuest } = useGuests()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setGuest({ ...guest, [field]: e.target.value })
  }

  const handlePreferenceChange = (value: string, field: string) => {
    setGuest({
      ...guest,
      preferences: {
        ...guest.preferences,
        [field]: value,
      },
    })
  }

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value.split(',').map(item => item.trim())
    setGuest({
      ...guest,
      preferences: {
        ...guest.preferences,
        [field]: value,
      },
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addGuest(guest)
    console.log('New guest added:', guest)
    setIsOpen(false)
    // Reset the form
    setGuest({
      id: '',
      first_name: '',
      last_name: '',
      birthday: '',
      gender: '',
      bonvoy_id: uuidv4(),
      email: '',
      phone_number: '',
      upcoming_bookings: [],
      past_bookings: [],
      preferences: {
        accessible: '',
        bed_type: '',
        room: {
          type: '',
          location: [],
          temperature: '',
        },
        pillow_type: [],
        prompt_priority: '',
        amenities: [],
        food_preferences: {
          favorites: [],
          dietary_restrictions: [],
        },
        beverages: {
          non_alcoholic: [],
          alcoholic: [],
        },
      },
      lastBooking: '',
      satisfaction: 0,
      loyalty: 0,
    })
  }

  return (
    <div>
      <Button variant="outline" className='absolute right-20 bottom-20 border border-orange-300 bg-gradient-to-t from-amber-500 to-amber-300 rounded text-gray-800' onClick={() => setIsOpen(true)}>Check In New Guest</Button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Guest Information</h2>
                <Button variant="ghost" onClick={() => setIsOpen(false)}>
                  <span className="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </Button>
              </div>
            </div>
            <div className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input id="first_name" value={guest.first_name} onChange={(e) => handleInputChange(e, 'first_name')} />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" value={guest.last_name} onChange={(e) => handleInputChange(e, 'last_name')} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input id="birthday" type="date" value={guest.birthday} onChange={(e) => handleInputChange(e, 'birthday')} />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => handleInputChange({ target: { value } } as any, 'gender')}>
                      <SelectTrigger className="w-full z-50">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className='z-50'>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
               
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={guest.email} onChange={(e) => handleInputChange(e, 'email')} />
                </div>
                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input id="phone_number" value={guest.phone_number} onChange={(e) => handleInputChange(e, 'phone_number')} />
                </div>
                <div>
                  <Label>Preferences</Label>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="accessible">Accessible</Label>
                      <Select onValueChange={(value) => handlePreferenceChange(value, 'accessible')}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select accessibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="bed_type">Bed Type</Label>
                      <Select onValueChange={(value) => handlePreferenceChange(value, 'bed_type')}>
                        <SelectTrigger className="w-full">
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
                    <div>
                      <Label htmlFor="room_type">Room Type</Label>
                      <Select onValueChange={(value) => handlePreferenceChange(value, 'room.type')}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="deluxe">Deluxe</SelectItem>
                          <SelectItem value="suite">Suite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="room_location">Room Location (comma-separated)</Label>
                      <Input 
                        id="room_location" 
                        value={guest.preferences.room.location.join(', ')} 
                        onChange={(e) => handleArrayInputChange(e, 'room.location')} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="room_temperature">Room Temperature</Label>
                      <Input 
                        id="room_temperature" 
                        value={guest.preferences.room.temperature} 
                        onChange={(e) => handlePreferenceChange(e.target.value, 'room.temperature')} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="pillow_type">Pillow Type (comma-separated)</Label>
                      <Input 
                        id="pillow_type" 
                        value={guest.preferences.pillow_type.join(', ')} 
                        onChange={(e) => handleArrayInputChange(e, 'pillow_type')} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="prompt_priority">Prompt Priority</Label>
                      <Input 
                        id="prompt_priority" 
                        value={guest.preferences.prompt_priority} 
                        onChange={(e) => handlePreferenceChange(e.target.value, 'prompt_priority')} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                      <Input 
                        id="amenities" 
                        value={guest.preferences.amenities.join(', ')} 
                        onChange={(e) => handleArrayInputChange(e, 'amenities')} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="food_favorites">Food Favorites (comma-separated)</Label>
                      <Input 
                        id="food_favorites" 
                        value={guest.preferences.food_preferences.favorites.join(', ')} 
                        onChange={(e) => {
                          const value = e.target.value.split(',').map(item => item.trim())
                          setGuest({
                            ...guest,
                            preferences: {
                              ...guest.preferences,
                              food_preferences: {
                                ...guest.preferences.food_preferences,
                                favorites: value,
                              },
                            },
                          })
                        }} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="dietary_restrictions">Dietary Restrictions (comma-separated)</Label>
                      <Input 
                        id="dietary_restrictions" 
                        value={guest.preferences.food_preferences.dietary_restrictions.join(', ')} 
                        onChange={(e) => {
                          const value = e.target.value.split(',').map(item => item.trim())
                          setGuest({
                            ...guest,
                            preferences: {
                              ...guest.preferences,
                              food_preferences: {
                                ...guest.preferences.food_preferences,
                                dietary_restrictions: value,
                              },
                            },
                          })
                        }} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="non_alcoholic">Non-Alcoholic Beverages (comma-separated)</Label>
                      <Input 
                        id="non_alcoholic" 
                        value={guest.preferences.beverages.non_alcoholic.join(', ')} 
                        onChange={(e) => {
                          const value = e.target.value.split(',').map(item => item.trim())
                          setGuest({
                            ...guest,
                            preferences: {
                              ...guest.preferences,
                              beverages: {
                                ...guest.preferences.beverages,
                                non_alcoholic: value,
                              },
                            },
                          })
                        }} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="alcoholic">Alcoholic Beverages (comma-separated)</Label>
                      <Input 
                        id="alcoholic" 
                        value={guest.preferences.beverages.alcoholic.join(', ')} 
                        onChange={(e) => {
                          const value = e.target.value.split(',').map(item => item.trim())
                          setGuest({
                            ...guest,
                            preferences: {
                              ...guest.preferences,
                              beverages: {
                                ...guest.preferences.beverages,
                                alcoholic: value,
                              },
                            },
                          })
                        }} 
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="lastBooking">Last Booking</Label>
                  <Input id="lastBooking" type="date" value={guest.lastBooking} onChange={(e) => handleInputChange(e, 'lastBooking')} />
                </div>
                <div>
                  <Label htmlFor="satisfaction">Satisfaction (0-100)</Label>
                  <Input 
                    id="satisfaction" 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={guest.satisfaction} 
                    onChange={(e) => handleInputChange(e, 'satisfaction')} 
                  />
                </div>
                <div>
                  <Label htmlFor="loyalty">Loyalty (0-100)</Label>
                  <Input 
                    id="loyalty" 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={guest.loyalty} 
                    onChange={(e) => handleInputChange(e, 'loyalty')} 
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
