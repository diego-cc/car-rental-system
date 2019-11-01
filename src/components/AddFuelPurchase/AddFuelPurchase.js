import React from 'react';

export class AddFuelPurchase extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
	  fields: {
		vehicleID: '',
		amount: 0,
		price: 0,
		rentalID: ''
	  }
	}
  }
}
