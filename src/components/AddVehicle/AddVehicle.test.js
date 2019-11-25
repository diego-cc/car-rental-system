/**
 * AddBooking.test.js
 */
import React from 'react';
import {act, fireEvent, render, wait} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {fakeAPI} from "../../setupTests";
import {AddVehicle} from "./AddVehicle";
import '@testing-library/jest-dom/extend-expect'
import {AppProvider} from "../../AppContext/AppContext";
import moment from "moment";

const initialContextValue = {
  vehicles: fakeAPI.vehicles,
  addResource: (resourceType, resource) => {
	if (resourceType.trim().toLowerCase() === 'vehicle') {
	  contextValue.vehicles.push(resource);
	}
  }
};

let tree, contextValue;

beforeEach(() => {
  contextValue = {...initialContextValue};
  tree = (
	<AppProvider value={contextValue}>
	  <MemoryRouter initialEntries={[`/add`]}>
		<Route path={`/add`} render={props => <AddVehicle {...props} />}/>
	  </MemoryRouter>
	</AppProvider>
  );
});

describe('AddVehicle component', () => {
  it('matches snapshot', () => {
    const component = render(tree);
    expect(component).toMatchSnapshot();
  });
});
