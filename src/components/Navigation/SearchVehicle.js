import React from 'react';
import Autosuggest from 'react-autosuggest';
import {AppContext} from "../../AppContext/AppContext";

export class SearchVehicle extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
	  value: '',
	  suggestions: []
	};
  }

  static contextType = AppContext;

  getSuggestions = value => {
	const inputValue = value.trim().toLowerCase();
	const inputLength = inputValue.length;

	return inputLength === 0 ? [] : this.context.vehicles.filter(v => (
	  v.manufacturer.trim().toLowerCase().slice(0, inputLength) === inputValue ||
	  v.model.trim().toLowerCase().slice(0, inputLength) === inputValue ||
	  v.year.trim().slice(0, inputLength) === inputValue
	));
  };

  getSuggestionValue = suggestion => suggestion.id;

  renderSuggestion = suggestion => (
	<div>
	  {`${suggestion.manufacturer} ${suggestion.model} (${suggestion.year})`}
	</div>
  );

  onChange = (e, {newValue}) => {
	this.setState({
	  value: newValue
	})
  };

  onSuggestionsFetchRequested = ({value}) => {
	this.setState({
	  suggestions: this.getSuggestions(value)
	})
  };

  onSuggestionsClearRequested = () => {
	this.setState({
	  suggestions: []
	})
  };

  render() {
	const {value, suggestions} = this.state;
	const inputProps = {
	  placeholder: 'Search for a vehicle...',
	  value,
	  onChange: this.onChange
	};

	return (
	  <Autosuggest
		suggestions={suggestions}
		onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
		onSuggestionsClearRequested={this.onSuggestionsClearRequested}
		getSuggestionValue={this.getSuggestionValue}
		renderSuggestion={this.renderSuggestion}
		inputProps={inputProps}
	  />
	);
  }
}
