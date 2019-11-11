import {BookingType} from './BookingType';
import moment from "moment";

export const calculateBookingCost = (booking, bookingJourneys) => {
  const COST_PER_DAY = 100;
  const COST_PER_KM = 1;
  let bookingCost;

  if (booking.bookingType === BookingType.PER_DAY) {
	bookingCost = calculateBookingDurationInDays(booking) * COST_PER_DAY;
  }
  else {
    if (Number.isNaN(calculateDistanceTravelledInKm(booking, findLastJourney(booking, bookingJourneys)))) {
      bookingCost = calculateDistanceTravelledInKm(booking, findLastJourney(booking, bookingJourneys));
	}
    else {
	  bookingCost = calculateDistanceTravelledInKm(booking, findLastJourney(booking, bookingJourneys)) * COST_PER_KM;
	}
  }

  return bookingCost;
};

export const calculateRevenueRecorded = (bookings, journeys) => {
  return Number.parseFloat(bookings.reduce((acc, booking) => {
	const bookingJourneys = journeys.filter(journey => journey.bookingID === booking.id);
	if (!Number.isNaN(calculateBookingCost(booking, bookingJourneys))) {
	  acc += calculateBookingCost(booking, bookingJourneys);
	}
	return acc;
  }, 0)).toFixed(2);
};

const calculateDistanceTravelledInKm = (booking, lastJourney) => {
  if (lastJourney) {
	const endOdometer = lastJourney.journeyEndOdometerReading;
	const startOdometer = booking.startOdometer;

	return endOdometer - startOdometer;
  }
  return 'Pending (no journeys have been made for this booking yet)';
};

const calculateBookingDurationInDays = booking => {
  const bookingStartDate = moment(booking.startDate);
  const bookingEndDate = moment(booking.endDate);

  return bookingEndDate.diff(bookingStartDate, 'days');
};

const findLastJourney = (booking, bookingJourneys) => {
  if (bookingJourneys.length) {
	const bookingEndDate = moment(booking.endDate);
	let lastJourneyIndex = 0;
	let minimumDateDiff = bookingEndDate.diff(moment(bookingJourneys[lastJourneyIndex].journeyEndedAt), 'days');
	let currentDiff = minimumDateDiff;

	bookingJourneys.forEach((journey, index) => {
	  currentDiff = bookingEndDate.diff(moment(journey.journeyEndedAt), 'days');
	  if (currentDiff < minimumDateDiff) {
		currentDiff = minimumDateDiff;
		lastJourneyIndex = index;
	  }
	});

	return bookingJourneys[lastJourneyIndex];
  }

  return null;
};

