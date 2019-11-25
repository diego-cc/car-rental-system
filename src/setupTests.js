/**
 * setupTests.js
 */
import React from 'react';
import {Vehicle} from "./Models/Vehicle";
import {Booking} from "./Models/Booking";
import moment from "moment";
import {Journey} from "./Models/Journey";
import {Service} from "./Models/Service";
import {FuelPurchase} from "./Models/FuelPurchase";

/**
 * An object containing fake seed data to be used in the unit tests
 * @type {{journeys: Array<Journey>, vehicles: Array<Vehicle>, fuelPurchases: Array<FuelPurchase>, services: Array<Service>, bookings: Array<Booking>}}
 */
export const fakeAPI = {
  vehicles: [
	new Vehicle('Tesla', 'Roadster', 2008, 500, '1TES999', 0, 'tesla-123'),
	new Vehicle('Ford', 'Ranger XL', 2015, 800, '1RANGER', 80, 'ranger-123'),
	new Vehicle('Holden', 'Commodore LT', 2018, 800, '1HOLDEN', 61, 'holden-123')
  ],
  bookings: [
	new Booking('tesla-123', 'D', moment(moment().subtract(1, 'day'), 'YYYY-MM-DD').format('YYYY-MM-DD'), moment(moment().add(2, 'days'), 'YYYY-MM-DD').format('YYYY-MM-DD'), 500, 600, 'tesla-booking'),
	new Booking('ranger-123', 'K', moment(moment().subtract(1, 'day'), 'YYYY-MM-DD').format('YYYY-MM-DD'), moment(moment().add(2, 'days'), 'YYYY-MM-DD').format('YYYY-MM-DD'), 800, 1000, 'ranger-booking'),
	new Booking('holden-123', 'K', moment(moment().subtract(1, 'day'), 'YYYY-MM-DD').format('YYYY-MM-DD'), moment(moment().add(2, 'days'), 'YYYY-MM-DD').format('YYYY-MM-DD'), 800, 1200, 'holden-booking')
  ],
  journeys: [
	new Journey('tesla-booking', 500, 550, moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'), moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'), "", "", 'tesla-journey'),
	new Journey('ranger-booking', 800, 950, moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'), moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'), "", "", 'ranger-journey'),
	new Journey('holden-booking', 800, 950, moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'), moment(moment(), 'YYYY-MM-DD').format('YYYY-MM-DD'), "", "", 'holden-journey')
  ],
  services: [
	new Service('tesla-123', 1000, moment(moment().add(10, 'days'), 'YYYY-MM-DD').format('YYYY-MM-DD'), 'tesla-service'),
	new Service('ranger-123', 1500, moment(moment().add(15, 'days'), 'YYYY-MM-DD').format('YYYY-MM-DD'), 'ranger-service'),
	new Service('holden-123', 2000, moment(moment().add(30, 'days'), 'YYYY-MM-DD').format('YYYY-MM-DD'), 'holden-service')
  ],
  fuelPurchases: [
	new FuelPurchase('tesla-booking', 20, 1.5, 'tesla-fuel'),
	new FuelPurchase('ranger-booking', 15, 1.3, 'ranger-fuel'),
	new FuelPurchase('holden-booking', 30, 1.2, 'ranger-fuel')
  ]
};

/**
 * An object that mocks the initial state of the app after the data has been fetched from an API
 * @type {{vehicles: Array<Vehicle>}}
 */
/*export const initialContextValue = {
  vehicles: fakeAPI.vehicles.map(v => {
	// find all bookings associated with "v"
	const associatedBookings = fakeAPI.bookings.filter(b => b.vehicleID === v.id);

	// for each associated booking, add all journeys and fuel purchases to it
	associatedBookings.forEach(b => {
	  const associatedJourneys = fakeAPI.journeys.filter(j => j.bookingID === b.id);
	  b.journeys.push(...associatedJourneys);

	  const associatedFuelPurchases = fakeAPI.fuelPurchases.filter(f => f.bookingID === b.id);
	  b.fuelPurchases.push(...associatedFuelPurchases);
	});

	// add associatedBookings to "v"
	v.bookings.push(...associatedBookings);

	// add all associated services to "v"
	v.services.push(...fakeAPI.services.filter(s => s.vehicleID === v.id));

	return v;
  })
};*/
