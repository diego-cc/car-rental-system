/**
 * BrowseVehicles.test.js
 */
import React from 'react';
import {render} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {fakeAPI} from "../../setupTests";
import {BrowseVehicles} from "./BrowseVehicles";
import '@testing-library/jest-dom/extend-expect'
import {AppProvider} from "../../AppContext/AppContext";

const initialContextValue = {
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
  }, []),
  loading: false,
  notification: {
    display: false,
	message: ''
  },
  deleteResource: {
	resourceType: '',
	resource: '',
	confirmDeleteResource: () => console.log('confirmDeleteResource'),
	showDeleteResourceModal: false,
	setDeleteResourceModalShow: () => console.log('setDeleteResourceModalShow')
  }
};

let tree, contextValue;

beforeEach(() => {
  contextValue = {...initialContextValue};
  tree = (
	<AppProvider value={contextValue}>
	  <MemoryRouter initialEntries={[`/browse`]}>
		<Route path={`/browse`} render={props => <BrowseVehicles {...props} />}/>
	  </MemoryRouter>
	</AppProvider>
  );
});

describe('BrowseVehicles component', () => {
  it('matches snapshot', () => {
	const component = render(tree);
	expect(component).toMatchSnapshot();
  });
});
