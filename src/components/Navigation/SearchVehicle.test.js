import {fakeAPI, setUpVehicles} from "../../setupTests";
import {AppProvider} from "../../AppContext/AppContext";
import {MemoryRouter} from "react-router-dom";
import {SearchVehicle} from "./SearchVehicle";
import { render, fireEvent, wait } from '@testing-library/react';
import React from "react";

let tree, contextValue;
const initialContextValue = {
  vehicles: setUpVehicles(fakeAPI).vehicles
};

beforeEach(() => {
  contextValue = {
	...initialContextValue
  };

  tree = (
	<AppProvider value={contextValue}>
	  <MemoryRouter initialEntries={[`/`]}>
		<SearchVehicle/>
	  </MemoryRouter>
	</AppProvider>
  )
});

describe('SearchVehicle component', () => {
  it ('matches snapshot', () => {
    const component = render(tree);
    expect(component).toMatchSnapshot();
  });

  /**
   * TODO: Figure out how to correctly trigger change events for this component, since it's
   * currently not working with Typeahead
   */
  /*it('filters the correct results by manufacturer', async () => {
	const {debug, getByPlaceholderText, getByText} = render(tree, {container: document.body});
	fireEvent.change(getByPlaceholderText("Search for a vehicle..."), {target: {value: 'test'}});

	await wait(() => {
	  debug();
	});
  }, 9999);

  it('filters the correct results by model', () => {

  });

  it('filters the correct results by year', () => {

  });*/
});
