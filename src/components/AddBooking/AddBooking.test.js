/**
 * AddBooking.test.js
 */
import React from 'react';
import {render} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {fakeAPI} from "../../setupTests";
import {AddBooking} from "./AddBooking";
import '@testing-library/jest-dom/extend-expect'
import {AppProvider} from "../../AppContext/AppContext";
import moment from "moment";

describe('AddBooking component', () => {
  it('loads AddBooking form with correct default values', async () => {
	const tree = (
	  <AppProvider value={fakeAPI}>
		<MemoryRouter initialEntries={[`/addBooking/tesla-123`]}>
		  <Route path={`/addBooking/:vehicleID`} render={props => <AddBooking {...props} />}/>
		</MemoryRouter>
	  </AppProvider>
	);

	const {getByLabelText} = await render(tree);
	expect(getByLabelText(/^Booking Type:/)).toHaveValue('K');
	expect(getByLabelText(/^Start Date:/)).toHaveValue(moment().format('YYYY-MM-DD'));
	expect(getByLabelText(/^End Date:/)).toHaveValue(moment().add(1, 'day').format('YYYY-MM-DD'));
	expect(getByLabelText(/^Start Odometer:/)).toHaveValue(500);
  });
});
