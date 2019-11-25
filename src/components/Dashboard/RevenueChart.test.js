/**
 * RevenueChart.test.js
 */
import React from 'react';
import {RevenueChart} from "./RevenueChart";
import {fakeAPI} from "../../setupTests";
import {calculateTotalRevenue} from '../App/calculateTotalRevenue';
import {mount} from 'enzyme';

const initialContext = {
  vehicles: fakeAPI.vehicles.reduce((updatedVehicles, v) => {
	// get all bookings for this vehicle
	const bookings = fakeAPI.bookings.filter(b => b.vehicleID === v.id);

	// get all journeys for this vehicle
	const journeys = fakeAPI.journeys.filter(j => bookings.some(b => b.id === j.bookingID));
	// add journeys to each booking
	journeys.forEach(j => {
	  bookings.find(b => b.id === j.bookingID).journeys.push(j);
	});

	// get all fuel purchases for this vehicle;
	const fuelPurchases = fakeAPI.fuelPurchases.filter(f => bookings.some(b => b.id === f.bookingID));
	// add fuel purchases to each booking
	fuelPurchases.forEach(f => {
	  bookings.find(b => b.id === f.bookingID).fuelPurchases.push(f);
	});

	// add bookings to this vehicle
	v.bookings.push(...bookings);

	// get all services for this vehicle
	const services = fakeAPI.services.filter(s => s.vehicleID === v.id);
	// add services to this vehicle
	v.services.push(...services);

	updatedVehicles.push(v);
	return updatedVehicles;
  }, [])
};

describe('RevenueChart component', () => {
  it('receives the correct revenue data by props', async () => {
	const data = calculateTotalRevenue(initialContext.vehicles);
	const wrapper = mount(<RevenueChart data={data}/>);
	expect(wrapper.props().data).toEqual([{monthAndYear: 'November 2019', revenue: 800}]);
  })
});
