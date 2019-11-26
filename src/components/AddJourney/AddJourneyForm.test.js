/**
 * AddJourneyForm.test.js
 */
import React from 'react';
import {act, fireEvent, render, wait} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect'
import {AppProvider} from "../../AppContext/AppContext";
import {fakeAPI} from "../../setupTests";
import {AddJourneyForm} from "./AddJourneyForm";
import moment from "moment";

let tree, contextValue;

const initialContextValue = {
  vehicles: fakeAPI.vehicles.map(v => {
	const vehicleBookings = fakeAPI.bookings.reduce((vBookings, b) => {
	  if (b.vehicleID === v.id) {
		b.journeys.push(...fakeAPI.journeys.filter(j => j.bookingID === b.id));
		vBookings.push(b);
	  }
	  return vBookings;
	}, []);
	v.bookings.push(...vehicleBookings);
	return v;
  }),
  addResource: (resourceType, resource) => {
	if (resourceType.trim().toLowerCase() === 'journey') {
	  contextValue
		.vehicles
		.find(v => v.bookings.some(b => b.id === resource.bookingID))
		.bookings
		.find(b => b.id === resource.bookingID)
		.journeys.push(resource);
	}
  }
};

beforeEach(() => {
  contextValue = {
	...initialContextValue,
	notification: {
	  display: false,
	  message: ''
	},
	loading: false
  };
  tree = (
	<AppProvider value={contextValue}>
	  <MemoryRouter initialEntries={[`/addJourneyForm/ranger-booking`]}>
		<Route path={`/addJourneyForm/:bookingID`}
			   render={props => <AddJourneyForm {...props} />}/>
	  </MemoryRouter>
	</AppProvider>
  );
});

describe('AddJourneyForm component', () => {
  it('loads AddJourneyForm with correct default values', () => {
    const associatedBooking = contextValue.vehicles.find(v => v.id === 'ranger-123').bookings.find(b => b.id === 'ranger-booking');

	const {getByLabelText} = render(tree);

	act(() => {
	  expect(getByLabelText(/^Journey started at:/)).toHaveValue(associatedBooking.startDate);
	  expect(getByLabelText(/^Journey ended at:/)).toHaveValue(associatedBooking.startDate);
	  expect(getByLabelText(/^Journey start odometer reading:/)).toHaveValue(800);
	  expect(getByLabelText(/^Journey end odometer reading:/)).toHaveValue(800);
	  expect(getByLabelText(/^Journey from:/)).toHaveValue('');
	  expect(getByLabelText(/^Journey to:/)).toHaveValue('');
	});
  });

  it('adds a new journey', async () => {
	const {getByText, getByLabelText} = render(tree);
	fireEvent.change(getByLabelText(/^Journey started at:/), {target: {value: '2019-11-26'}});
	fireEvent.change(getByLabelText(/^Journey ended at:/), {target: {value: '2019-11-26'}});
	fireEvent.click(getByText(/^Add journey/));

	await wait(() => {
	  const vehicle = contextValue.vehicles.find(v => v.bookings.some(b => b.id === 'ranger-booking'));
	  expect(vehicle.bookings.find(b => b.id === 'ranger-booking')
		.journeys.length)
		.toBe(3);
	});
  });
});
