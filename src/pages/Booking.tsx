
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingView from '@/components/calendar/BookingView';
import { BookingType } from '@/components/calendar/EditBookingTypeDialog';

// Sample booking types for demo
const SAMPLE_BOOKING_TYPES: BookingType[] = [
  { id: 'sales-call', name: 'Sales Call', duration: 30 },
  { id: 'product-demo', name: 'Product Demo', duration: 60 },
  { id: 'discovery', name: 'Discovery Call', duration: 45 },
  { id: 'consultation', name: 'Consultation', duration: 60 },
];

const Booking = () => {
  const { bookingTypeId } = useParams<{ bookingTypeId: string }>();
  const navigate = useNavigate();
  
  const selectedBookingType = SAMPLE_BOOKING_TYPES.find(type => type.id === bookingTypeId) || SAMPLE_BOOKING_TYPES[0];
  
  const handleBookingComplete = () => {
    // In a real app, this would update the calendar, send notifications, etc.
    // console.log("Booking completed:", selectedBookingType);
  };
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <BookingView 
          bookingType={selectedBookingType} 
          onBookingComplete={handleBookingComplete}
        />
      </div>
    </div>
  );
};

export default Booking;
