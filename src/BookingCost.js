import {BookingType} from './BookingType';

export const calculateBookingCost = booking => {
  const COST_PER_DAY = 100;
  const COST_PER_KM = 1;
  let bookingCost;

  if (booking.bookingType === BookingType.PER_DAY) {
	bookingCost = booking.units * COST_PER_DAY;
  }
  else {
    if (Number.isNaN(booking.units)) {
      bookingCost = booking.units;
	}
    else {
	  bookingCost = booking.units * COST_PER_KM;
	}
  }

  return bookingCost;
};
