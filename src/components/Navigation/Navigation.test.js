import React from 'react';
import { render } from '@testing-library/react';
import {Navigation} from "./Navigation";
import {MemoryRouter} from "react-router-dom";
import {AppProvider} from "../../AppContext/AppContext";
import {fakeAPI, setUpVehicles} from "../../setupTests";

let contextValue;
const initialContextValue = {
  vehicles: setUpVehicles(fakeAPI).vehicles
};

describe('Navigation component', () => {
  it('matches snapshot', () => {
    contextValue = {
      ...initialContextValue
	};

    const component = render(
      <AppProvider value={contextValue}>
		<MemoryRouter>
		  <Navigation />
		</MemoryRouter>
	  </AppProvider>
      );

    expect(component).toMatchSnapshot();
  })
});
