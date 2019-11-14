import {BookingType} from './BookingType';
import moment from "moment";

export const calculateBookingCost = (booking, bookingJourneys) => {
  const COST_PER_DAY = 100;
  const COST_PER_KM = 1;
  let bookingCost;

  if (booking.bookingType === BookingType.PER_DAY) {
	bookingCost = calculateBookingCostInDays(booking);
  } else {
	if (Number.isNaN(calculateDistanceTravelledInKm(booking, findLastOdometerReading(bookingJourneys)))) {
	  bookingCost = calculateDistanceTravelledInKm(booking, findLastOdometerReading(bookingJourneys));
	} else {
	  bookingCost = calculateDistanceTravelledInKm(booking, findLastOdometerReading(bookingJourneys)) * COST_PER_KM;
	}
  }
  return bookingCost;
};

export const calculateRevenueRecorded = (bookings, journeys) => {
  const bookingsPerDay = bookings.filter(b => b.bookingType === 'D');
  const bookingsPerDayRevenue = bookingsPerDay.reduce((acc, b) => {
	acc += calculateBookingCostInDays(b);
	return acc;
  }, 0);

  const bookingsPerKm = bookings.filter(b => b.bookingType === 'K');
  const bookingsPerKmRevenue = bookingsPerKm.reduce((acc, b) => {
    // get all journeys associated with this booking
	const bookingJourneys = journeys.filter(j => b.id === j.bookingID);
	const totalKm = bookingJourneys.reduce((km, j) => {
	  km += j.journeyEndOdometerReading - j.journeyStartOdometerReading;
	  return km;
	}, 0);
	acc += totalKm;
	return acc;
  }, 0);

  return bookingsPerDayRevenue + bookingsPerKmRevenue;
};
/*export const calculateRevenueRecorded = (bookings, journeys) => {
  return Number.parseFloat(bookings.reduce((acc, booking) => {
	const bookingJourneys = journeys.filter(journey => journey.bookingID === booking.id);
	if (!Number.isNaN(calculateBookingCost(booking, bookingJourneys))) {
	  acc += calculateBookingCost(booking, bookingJourneys);
	}
	return acc;
  }, 0)).toFixed(2);
};*/

const calculateDistanceTravelledInKm = (booking, lastOdometerReading) => {
  if (lastOdometerReading) {
	const endOdometer = lastOdometerReading;
	const startOdometer = booking.startOdometer;

	return endOdometer - startOdometer;
  }
  return 'Pending (no journeys have been made for this booking yet)';
};

const calculateBookingCostInDays = booking => {
  const bookingStartDate = moment(booking.startDate);
  const bookingEndDate = moment(booking.endDate);

  return bookingEndDate.diff(bookingStartDate, 'days') * 100;
};

const findLastOdometerReading = bookingJourneys => {
  if (bookingJourneys && bookingJourneys.length) {
	return bookingJourneys
	  .map(j => j.journeyEndOdometerReading)
	  .reduce((a, b) => Math.max(a, b))
  }
  return 0;
};
