/**
 * AddBooking.test.js
 */
import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {fakeAPI} from "../../setupTests";
import {AddBooking} from "./AddBooking";
import '@testing-library/jest-dom/extend-expect'
import {AppProvider} from "../../AppContext/AppContext";
import moment from "moment";
import {act} from "@testing-library/react";

let contextValue;
beforeEach(() => {
  contextValue = {
	vehicles: fakeAPI.vehicles.map(v => {
	  fakeAPI.bookings.forEach(b => {
		fakeAPI.journeys.forEach(j => {
		  if (j.bookingID === b.id) {
			b.journeys.push(j);
		  }
		});
		if (b.vehicleID === v.id) {
		  v.bookings.push(b);
		}
	  });
	  fakeAPI.services.forEach(s => {
		if (s.vehicleID === v.id) {
		  v.services.push(s);
		}
	  });
	  return v;
	}),
	addResource: (resourceType, resource) => {
	  if (resourceType.trim().toLowerCase() === 'booking') {
		contextValue.vehicles.find(v => v.id === resource.vehicleID).bookings.push(resource);
	  }
	}
  }
});

describe('AddBooking component', () => {
  it('loads AddBooking form with correct default values', () => {
	let component;
	act(() => {
	  const tree = (
		<AppProvider value={contextValue}>
		  <MemoryRouter initialEntries={[`/addBooking/tesla-123`]}>
			<Route path={`/addBooking/:vehicleID`} render={props => <AddBooking {...props} />}/>
		  </MemoryRouter>
		</AppProvider>
	  );
	  component = render(tree);
	  const {getByLabelText} = component;
	  expect(getByLabelText(/^Booking Type:/)).toHaveValue('D');
	  expect(getByLabelText(/^Start Date:/)).toHaveValue(moment().format('YYYY-MM-DD'));
	  expect(getByLabelText(/^End Date:/)).toHaveValue(moment().add(1, 'day').format('YYYY-MM-DD'));
	  expect(getByLabelText(/^Start Odometer:/)).toHaveValue(500);
	});
  });

  it('warns the user in case there are booking conflicts', async () => {
	let component;

	// we need to use async/await here
	// see https://github.com/jaredpalmer/formik/issues/1543
	await act(async () => {
	  const tree = (
		<AppProvider value={contextValue}>
		  <MemoryRouter initialEntries={[`/addBooking/tesla-123`]}>
			<Route path={`/addBooking/:vehicleID`} render={props => <AddBooking {...props} />}/>
		  </MemoryRouter>
		</AppProvider>
	  );
	  component = render(tree);
	  const {getByText} = component;
	  fireEvent.click(getByText('Add booking'));
	});
  })
});
