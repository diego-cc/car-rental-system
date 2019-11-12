import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import {AppConsumer, AppContext} from "../../AppContext/AppContext";

export class SearchVehicle extends React.Component {

  render() {
	return (
	  <AppConsumer>
		{
		  ({vehicles}) => (
			<Typeahead
			  labelKey={(option) => `${option.manufacturer} ${option.model} (${option.year})`}
			  filterBy={['manufacturer', 'model', 'year']}
			  options={vehicles}
			  placeholder="Search for a vehicle..."
			  highlightOnlyResult
			  minLength="1"
			  />
		  )
		}
	  </AppConsumer>
	)
  }
}

SearchVehicle.contextType = AppContext;
