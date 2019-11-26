/**
 * App.js
 */
import React from 'react';
import {Navigation} from "../Navigation/Navigation";
import {BrowseVehicles} from "../BrowseVehicles/BrowseVehicles";
import {Route, Switch} from 'react-router-dom';
import {AddVehicle} from "../AddVehicle/AddVehicle";
import {firebase} from "../../Firebase/Firebase";
import {AppProvider} from "../../AppContext/AppContext";
import {EditVehicle} from "../EditVehicle/EditVehicle";
import {AddBooking} from "../AddBooking/AddBooking";
import {AddService} from "../AddService/AddService";
import {AddJourney} from "../AddJourney/AddJourney";
import {AddJourneyForm} from "../AddJourney/AddJourneyForm";
import {AddFuelPurchase} from "../AddFuelPurchase/AddFuelPurchase";
import {AddFuelPurchaseForm} from "../AddFuelPurchase/AddFuelPurchaseForm";
import {ShowVehicle} from "../ShowVehicle/ShowVehicle";
import {Vehicle} from "../../Models/Vehicle";
import {Booking} from "../../Models/Booking";
import {Journey} from "../../Models/Journey";
import {Service} from "../../Models/Service";
import {FuelPurchase} from "../../Models/FuelPurchase";
import {Dashboard} from "../Dashboard/Dashboard";
import {calculateTotalRevenue} from "./calculateTotalRevenue";

/**
 * App component - entry point of this application
 */
export class App extends React.Component {
  constructor(props) {
	super(props);

	/**
	 * Automatically dismisses notifications after 3.5 secs
	 */
	this.dismissNotification = () => {
	  setTimeout(() => {
		this.setState({
		  notification: {
			display: false,
			message: ''
		  }
		})
	  }, 3500)
	};

	/**
	 * Edits a vehicle and updates both the state and firebase
	 * @param {Vehicle} vehicle - a vehicle object that has the same ID as the vehicle to be
	 * edited (for immutability), containing updated data
	 */
	this.editVehicle = vehicle => {
	  let fieldsChanged = {};
	  this.setState({
		loading: true
	  }, () => {
		this.setState(prevState => {
		  const {vehicles} = {...prevState};
		  const oldVehicleIndex = vehicles.findIndex(v => v.id === vehicle.id);
		  const oldVehicle = vehicles[oldVehicleIndex];
		  fieldsChanged = Object
			.keys(oldVehicle)
			.reduce((fields, field) => {
			  if ((oldVehicle[field] !== vehicle[field]) && !Array.isArray(vehicle[field])) {
			    fields[field] = vehicle[field];
			  }
			  return fields;
			}, {});
		  vehicles[oldVehicleIndex] = vehicle;

		  return ({
			...prevState,
			vehicles
		  })
		}, () => {
		  const db = firebase.firestore();

		  return db
			.collection('vehicles')
			.doc(vehicle.id)
			.update(fieldsChanged)
			.then(() => {
			  this.setState({
				loading: false,
				notification: {
				  display: true,
				  message: `The vehicle has been successfully updated`
				}
			  }, this.dismissNotification)
			})
			.catch(err => {
			  this.setState({
				loading: false,
				notification: {
				  display: true,
				  message: `Could not edit vehicle: ${err}`
				}
			  }, () => {
				this.dismissNotification();
				console.dir(err);
			  })
			})
		});
	  })
	};

	/**
	 * Adds a new resource and updates both the state and firebase
	 * @param {string} resourceType - one of: "vehicle", "booking", "journey", "service", "fuel
	 * purchase" or "fuelPurchase"
	 * @param {Vehicle|Booking|Journey|Service|FuelPurchase} resource
	 */
	this.addResource = (resourceType, resource) => {
	  if (!resourceType || !resource) {
		return this.setState({
		  notification: {
			display: true,
			message: 'Error: missing resource or resource type'
		  }
		}, this.dismissNotification)
	  }
	  let collectionName, collection;

	  switch (resourceType.trim().toLowerCase()) {
		case 'vehicle':
		  collectionName = 'vehicles';
		  break;

		case 'booking':
		  collectionName = 'bookings';
		  break;

		case 'service':
		  collectionName = 'services';
		  break;

		case 'journey':
		  collectionName = 'journeys';
		  break;

		case 'fuelpurchase':
		case 'fuel purchase':
		  collectionName = 'fuelPurchases';
		  break;

		default:
		  break;
	  }
	  let selectedVehicle, selectedVehicleIndex;
	  this.setState(prevState => {
		collection = collectionName && prevState[collectionName];
		if (!collection) {
		  return ({
			notification: {
			  display: true,
			  message: 'Error: invalid resource type provided'
			}
		  })
		} else {
		  const {vehicles} = prevState;
		  switch (collectionName) {
			case 'services':
			case 'bookings':
			  selectedVehicle = vehicles.find(v => v.id === resource.vehicleID);
			  selectedVehicleIndex = vehicles.findIndex(v => v.id === resource.vehicleID);
			  if (collectionName === 'services') {
				selectedVehicle.addService(resource);
			  } else {
				selectedVehicle.addBooking(resource);
			  }
			  break;

			case 'journeys':
			case 'fuelPurchases':
			  selectedVehicle = vehicles.find(v => v.bookings.some(b => b.id === resource.bookingID));
			  selectedVehicleIndex = vehicles.findIndex(v => v.bookings.some(b => b.id === resource.bookingID));
			  if (collectionName === 'journeys') {
				selectedVehicle.addJourney(resource);
			  } else {
				selectedVehicle.addFuelPurchase(resource);
			  }
			  break;

			default:
			  collection.push(resource);
			  break;
		  }
		}

		if (collectionName === 'vehicles') {
		  return ({
			loading: true,
			vehicles: collection
		  })
		} else {
		  prevState.vehicles[selectedVehicleIndex] = selectedVehicle;
		  return ({
			loading: true,
			vehicles: [...prevState.vehicles]
		  })
		}
	  }, () => {
		if (collectionName && collection) {
		  const db = firebase.firestore();
		  db
			.collection(collectionName)
			.doc(resource.id)
			.set({...resource})
			.then(() => {
			  this.setState(prevState => ({
				loading: false,
				revenue: calculateTotalRevenue(prevState.vehicles),
				notification: {
				  display: true,
				  message: `The new ${resourceType} has been successfully added to the system`
				}
			  }), this.dismissNotification)
			})
			.catch(err => {
			  this.setState({
				loading: false,
				notification: {
				  display: true,
				  message: `Could not add new ${resourceType}. Error: ${err.message}`
				}
			  }, this.dismissNotification)
			})
		} else {
		  this.setState({
			notification: {
			  display: false,
			  message: ''
			}
		  })
		}
	  })
	};

	/**
	 * Deletes a resource (after confirmation by the user) from both the state and firebase
	 * @param {string} resourceType - one of: "vehicle", "booking", "journey", "service", "fuel
	 * purchase" or "fuelPurchase"
	 * @param {Vehicle|Booking|Journey|Service|FuelPurchase} resource
	 */
	this.confirmDeleteResource = (resourceType, resource) => {
	  if (resourceType && resource) {
		this.setDeleteResourceModalShow(null, null, () => {
		  this.setState(prevState => ({
			...prevState,
			loading: true
		  }), () => {
			let collection;
			switch (resourceType.trim().toLowerCase()) {
			  case 'vehicle':
				collection = 'vehicles';
				break;

			  case 'journey':
				collection = 'journeys';
				break;

			  case 'service':
				collection = 'services';
				break;

			  case 'booking':
				collection = 'bookings';
				break;

			  case 'fuel purchase':
			  case 'fuelpurchase':
				collection = 'fuelPurchases';
				break;

			  default:
				break;
			}
			if (collection) {
			  const db = firebase.firestore();
			  if (collection === 'vehicles') {
				// delete everything associated with the vehicle first
				// delete journeys and bookings
				resource.bookings.forEach(b => {
				  // delete all journeys for each booking
				  b.journeys.forEach(j => {
					db
					  .collection('journeys')
					  .doc(j.id)
					  .delete()
				  });

				  // delete all fuel purchases for this booking
				  b.fuelPurchases.forEach(f => {
					db
					  .collection('fuelPurchases')
					  .doc(f.id)
					  .delete()
				  });

				  // delete the booking itself
				  db
					.collection('bookings')
					.doc(b.id)
					.delete()
				});

				// delete services
				resource.services.forEach(s => {
				  db
					.collection('services')
					.doc(s.id)
					.delete()
				});

				// delete the vehicle itself
				db
				  .collection('vehicles')
				  .doc(resource.id)
				  .delete()
				  .then(() => {
					this.setState(prevState => {
					  let {vehicles} = prevState;
					  vehicles = vehicles.filter(v => v.id !== resource.id);
					  return ({
						vehicles,
						loading: false,
						revenue: this.calculateTotalRevenue(vehicles),
						notification: {
						  display: true,
						  message: `The ${resourceType} has been successfully removed from the system`
						}
					  });
					}, this.dismissNotification)
				  })
			  } else if (collection === 'bookings') {
				// delete booking from state first
				this.setState(prevState => {
				  const {vehicles} = prevState;
				  const vehicleToBeModified = vehicles.find(v => v.bookings.some(b => b.id === resource.id));
				  vehicleToBeModified.removeBookingByID(resource.id);
				  return ({
					vehicles: [
					  ...vehicles.filter(v => v.id !== vehicleToBeModified.id),
					  vehicleToBeModified
					]
				  })
				}, () => {
				  // delete booking from firebase
				  db
					.collection('bookings')
					.doc(resource.id)
					.delete()
					.then(() => {
					  this.setState(prevState => ({
						loading: false,
						revenue: this.calculateTotalRevenue(prevState.vehicles),
						notification: {
						  display: true,
						  message: `The ${resourceType} has been successfully removed from the system`
						}
					  }), this.dismissNotification)
					})
					.catch(err => {
					  this.state({
						loading: false,
						notification: {
						  display: true,
						  message: `Error: ${err.message}`
						}
					  })
					})
				})
			  } else if (collection === 'journeys') {
				// delete journey from state
				this.setState(prevState => {
				  const {vehicles} = prevState;
				  const vehicleToBeModified = vehicles.find(v => v.bookings.some(b => b.id === resource.bookingID));
				  vehicleToBeModified.removeJourneyByBookingID(resource, resource.bookingID);

				  return ({
					vehicles: [
					  ...vehicles.filter(v => v.id !== vehicleToBeModified.id),
					  vehicleToBeModified
					]
				  })
				}, () => {
				  // delete journey from firebase
				  db
					.collection('journeys')
					.doc(resource.id)
					.delete()
					.then(() => {
					  this.setState(prevState => ({
						loading: false,
						revenue: this.calculateTotalRevenue(prevState.vehicles),
						notification: {
						  display: true,
						  message: `The ${resourceType} has been successfully removed from the system`
						}
					  }), this.dismissNotification)
					})
				})

			  } else if (collection === 'services') {
				// delete service from state
				this.setState(prevState => {
				  const {vehicles} = prevState;
				  const vehicleToBeModified = vehicles.find(v => v.id === resource.vehicleID);
				  vehicleToBeModified.removeServiceByID(resource.id);

				  return ({
					vehicles: [
					  ...vehicles.filter(v => v.id !== vehicleToBeModified.id),
					  vehicleToBeModified
					]
				  })
				}, () => {
				  // delete service from firebase
				  db
					.collection('services')
					.doc(resource.id)
					.delete()
					.then(() => {
					  this.setState({
						loading: false,
						notification: {
						  display: true,
						  message: `The ${resourceType} has been successfully removed from the system`
						}
					  }, this.dismissNotification)
					})
				})
			  } else if (collection === 'fuelPurchases') {
				// delete fuel purchase from the state
				this.setState(prevState => {
				  const {vehicles} = prevState;
				  const vehicleToBeModified = vehicles.find(v => v.bookings.some(b => b.id === resource.bookingID));
				  vehicleToBeModified.removeFuelPurchaseByBookingID(resource, resource.bookingID);

				  return ({
					vehicles: [
					  ...vehicles.filter(v => v.id !== vehicleToBeModified.id),
					  vehicleToBeModified
					]
				  })
				}, () => {
				  // delete fuel purchase from firebase
				  db
					.collection('fuelPurchases')
					.doc(resource.id)
					.delete()
					.then(() => {
					  this.setState({
						loading: false,
						notification: {
						  display: true,
						  message: `The ${resourceType} has been successfully removed from the system`
						}
					  }, this.dismissNotification)
					})
				})
			  } else {
				this.setState({
				  loading: false,
				  notification: {
					display: true,
					message: `Error: the collection associated with the item to be deleted was not found`
				  }
				}, this.dismissNotification)
			  }
			}
		  })
		})
	  }
	};

	/**
	 *
	 * @param resourceType
	 * @param resource
	 * @param callback
	 */
	this.setDeleteResourceModalShow = (resourceType, resource, callback) => {
	  this.setState(prevState => ({
		deleteResource: {
		  ...prevState.deleteResource,
		  resource: resource ? resource : prevState.deleteResource.resource,
		  resourceType: resourceType ? resourceType : prevState.deleteResource.resourceType,
		  showDeleteResourceModal: !prevState.deleteResource.showDeleteResourceModal
		}
	  }), callback);
	};

	this.state = {
	  loading: true,
	  vehicles: [],
	  services: [],
	  bookings: [],
	  journeys: [],
	  fuelPurchases: [],
	  revenue: [],
	  addVehicle: this.addVehicle,
	  editVehicle: this.editVehicle,
	  deleteResource: {
		resourceType: '',
		resource: '',
		confirmDeleteResource: this.confirmDeleteResource,
		showDeleteResourceModal: false,
		setDeleteResourceModalShow: this.setDeleteResourceModalShow
	  },
	  addResource: this.addResource,
	  addBooking: this.addBooking,
	  addJourney: this.addJourney,
	  addService: this.addService,
	  addFuelPurchase: this.addFuelPurchase,
	  notification: {
		display: false,
		message: ''
	  }
	};
  }

  /**
   * Fetches all collections from firebase, organises the data in the state and updates
   * odometers, if need be
   */
  componentDidMount() {
	this
	  .fetchCollections('vehicles', 'bookings', 'journeys', 'services', 'fuelPurchases')
	  .then(values => {
		// move services, bookings, journeys and fuel purchases to the respective vehicle
		this.setState(prevState => {
		  const {services, bookings, journeys, fuelPurchases, vehicles} = prevState;

		  let vehicleJourneys, vehicleServices, vehicleFuelPurchases;

		  // add each booking to the respective vehicle
		  vehicles.forEach(v => {
			bookings
			  .filter(b => b.vehicleID === v.id)
			  .forEach(b => {
				v.addBooking(b);
			  })
		  });

		  // add all other collections to the respective vehicle
		  vehicles.forEach(v => {
			vehicleJourneys = journeys.filter(j => v.bookings.some(b => b.id === j.bookingID));
			vehicleJourneys.forEach(j => {
			  v.addJourney(j);
			});

			vehicleFuelPurchases = fuelPurchases.filter(f => v.bookings.some(b => b.id === f.bookingID));
			vehicleFuelPurchases.forEach(f => {
			  v.addFuelPurchase(f);
			});

			vehicleServices = services.filter(s => s.vehicleID === v.id);
			vehicleServices.forEach(s => {
			  v.addService(s);
			});

		  });

		  // update odometers and notify user
		  vehicles.forEach(v => {
			v.updateVehicleOdometer(() => {
			  this.setState({
				notification: {
				  display: true,
				  message: `Updated odometer for ${v.manufacturer} ${v.model} (${v.year})`
				}
			  }, this.dismissNotification)
			});
		  });

		  const revenue = calculateTotalRevenue(vehicles);
		  return ({
			vehicles,
			revenue
		  })
		});
	  })
	  .catch(err => {
		// display error message
		this.setState({
		  notification: {
			display: true,
			message: `Error: ${err.message}`
		  }
		}, this.dismissNotification)
	  })
  }

  /**
   * Fetches a collection from firebase and adds it to the state
   * @param {string} collection - one of: "vehicles", "bookings", "journeys, "services" or
   * "fuelPurchases"
   * @returns {Promise<firebase.firestore.QuerySnapshot>}
   */
  fetchCollection = (collection) => {
	const formattedCollection = collection.trim().toLowerCase();
	const db = firebase.firestore();
	return db
	  .collection(collection)
	  .get()
	  .then(querySnapshot => {
		let data = querySnapshot.docs.map(doc => doc.data());

		this.setState(prevState => {
		  data = data.map(resource => {
			switch (formattedCollection) {
			  case 'vehicles':
				resource = new Vehicle(resource._manufacturer, resource._model, resource._year, resource._odometerReading, resource._registrationNumber, resource._tankCapacity, resource._id, resource._createdAt, resource._updatedAt);
				break;

			  case 'bookings':
				resource = new Booking(resource._vehicleID, resource._bookingType, resource._startDate, resource._endDate, resource._startOdometer, resource._endOdometer, resource._id, resource._createdAt, resource._updatedAt);
				break;

			  case 'journeys':
				resource = new Journey(resource._bookingID, resource._journeyStartOdometerReading, resource._journeyEndOdometerReading, resource._journeyStartedAt, resource._journeyEndedAt, resource._journeyFrom, resource._journeyTo, resource._id, resource._createdAt, resource._updatedAt);
				break;

			  case 'services':
				resource = new Service(resource._vehicleID, resource._serviceOdometer, resource._servicedAt, resource._id, resource._createdAt, resource._updatedAt);
				break;

			  case 'fuelpurchases':
			  case 'fuel purchases':
				resource = new FuelPurchase(resource._bookingID, resource._fuelQuantity, resource._fuelPrice, resource._id, resource._createdAt, resource._updatedAt);
				break;

			  default:
				break;
			}
			return resource;
		  });

		  return ({
			loading: false,
			[collection]: [...data]
		  })
		}, () => {

		})
	  })
	  .catch(e => {
		this.setState({
		  loading: false
		}, () => {
		  console.dir(e);
		})
	  })
  };

  /**
   * Fetches multiple collections from firebase
   * @param {Array<string>|string} collections - array of collection names to be fetched
   * @returns {Promise<firebase.firestore.QuerySnapshot[]>}
   */
  async fetchCollections(...collections) {
	return Promise.all(collections.map(collection => this.fetchCollection(collection)))
  }

  render() {
	return (
	  <AppProvider value={this.state}>
		<Navigation/>
		<Switch>
		  <Route exact path="/" render={props => <Dashboard {...props} />}/>
		  <Route path="/browse">
			<BrowseVehicles/>
		  </Route>
		  <Route path="/add" render={(props) => <AddVehicle {...props} />}/>
		  <Route path="/show/:vehicleID" render={(props) => <ShowVehicle {...props} />}/>
		  <Route path="/edit/:vehicleID" render={(props) => <EditVehicle {...props} />}/>
		  <Route path="/addBooking/:vehicleID" render={(props) => <AddBooking {...props} />}/>
		  <Route path="/addJourney/:vehicleID" render={(props) => <AddJourney {...props} />}/>
		  <Route path="/addJourneyForm/:bookingID"
				 render={(props) => <AddJourneyForm {...props} />}/>
		  <Route path="/addService/:vehicleID" render={(props) => <AddService {...props} />}/>
		  <Route path="/addFuelPurchase/:vehicleID"
				 render={(props) => <AddFuelPurchase {...props} />}/>
		  <Route path="/addFuelPurchaseForm/:bookingID"
				 render={(props) => <AddFuelPurchaseForm {...props} />}/>
		  <Route path="*" render={(props) => <BrowseVehicles {...props}/>}/>
		</Switch>
	  </AppProvider>
	)
  }
}
