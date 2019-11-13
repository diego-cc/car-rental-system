import React, {useState} from 'react';
import {Typeahead} from 'react-bootstrap-typeahead';
import {AppConsumer} from "../../AppContext/AppContext";
import {Button, Form, FormGroup} from "react-bootstrap";
import { useHistory } from 'react-router-dom';

export const SearchVehicle = props => {
  const [selected, setSelected] = useState([]);
  const history = useHistory();

  const handleSubmit = e => {
	e.preventDefault();

	if (selected && selected.length) {
	  history.push(`/show/${selected[0].id}`);
	}
  };

  return (
	<AppConsumer>
	  {
		({vehicles}) => (
		  <Form inline onSubmit={handleSubmit} className="mr-3">
			<FormGroup>
			  <Typeahead
				id="search-vehicle"
				labelKey={(option) => `${option.manufacturer} ${option.model} (${option.year})`}
				filterBy={['manufacturer', 'model', 'year']}
				options={vehicles}
				placeholder="Search for a vehicle..."
				highlightOnlyResult
				minLength={1}
				onChange={selected => setSelected(selected)}
			  />
			  <Button variant="outline-primary" type="submit" className="ml-3">
				Search
			  </Button>
			</FormGroup>
		  </Form>
		)
	  }
	</AppConsumer>
  )
};
