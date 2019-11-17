import moment from "moment";
import {Service} from "./Service";
import {firebase} from "../Firebase/Firebase";

export class Vehicle {
  _id;
  _manufacturer;
  _model;
  _year;
  _odometerReading;
  _registrationNumber;
  _tankCapacity;
  _bookings = [];
  _services = [];
  _createdAt;
  _updatedAt;


  constructor(manufacturer, model, year, odometerReading, registrationNumber, tankCapacity, id = require('uuid/v4')(), createdAt = moment().format('DD/MM/YYYY hh:mm:ss A'), updatedAt = null) {
    this._id = id;
    this._manufacturer = manufacturer;
    this._model = model;
    this._year = year;
    this._odometerReading = odometerReading;
    this._registrationNumber = registrationNumber;
    this._tankCapacity = tankCapacity;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  addBooking(newBooking) {
    this.bookings.push(newBooking);
  }

  removeBookingByID(bookingID) {
    if (bookingID) {
      const bookingsCopy = [...this.bookings];
      const bookingToBeDeleted = bookingsCopy.find(booking => booking.id === bookingID);

      if (bookingToBeDeleted) {
        this.bookings = bookingsCopy.filter(booking => booking.id !== bookingToBeDeleted.id);
      }
    }
  }

  removeJourneyByBookingID(journey, bookingID) {
	this.bookings.find(b => b.id === bookingID).removeJourney(journey);
  }

  addJourney(newJourney) {
    this.bookings.find(b => b.id === newJourney.bookingID).addJourney(newJourney);
  }

  addService(newService) {
    this.services.push(newService);
  }

  removeServiceByID(serviceID) {
    if (serviceID) {
      const servicesCopy = [...this.services];
      const serviceToBeDeleted = servicesCopy.find(service => service.id === serviceID);

      if (serviceToBeDeleted) {
        this.services = servicesCopy.filter(service => service.id !== serviceToBeDeleted.id);
      }
    }
  }

  addFuelPurchase(newFuelPurchase) {
    this.bookings.find(b => b.id === newFuelPurchase.bookingID).addFuelPurchase(newFuelPurchase);
  }

  removeFuelPurchaseByBookingID(fuelPurchase, bookingID) {
    this.bookings.find(b => b.id === bookingID).removeFuelPurchase(fuelPurchase);
  }

  get bookings() {
    return this._bookings;
  }

  set bookings(value) {
    this._bookings = value;
  }

  get journeys() {
    return this._bookings.reduce((journeys, b) => {
      b.journeys.forEach(j => {
        journeys.push(j);
      });
      return journeys;
    }, []);
  }

  get services() {
    return this._services;
  }

  set services(value) {
    this._services = value;
  }

  get fuelPurchases() {
    return this._fuelPurchases;
  }

  set fuelPurchases(value) {
    this._fuelPurchases = value;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get manufacturer() {
    return this._manufacturer;
  }

  set manufacturer(value) {
    this._manufacturer = value;
  }

  get model() {
    return this._model;
  }

  set model(value) {
    this._model = value;
  }

  get year() {
    return this._year;
  }

  set year(value) {
    this._year = value;
  }

  get odometerReading() {
    return this._odometerReading;
  }

  set odometerReading(value) {
    this._odometerReading = value;
  }

  get registrationNumber() {
    return this._registrationNumber;
  }

  set registrationNumber(value) {
    this._registrationNumber = value;
  }

  get tankCapacity() {
    return this._tankCapacity;
  }

  set tankCapacity(value) {
    this._tankCapacity = value;
  }

  get createdAt() {
    return this._createdAt;
  }

  set createdAt(value) {
    this._createdAt = value;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  set updatedAt(value) {
    this._updatedAt = value;
  }

  printDetails() {
    return ({
      'Vehicle': `${this.manufacturer} ${this.model} (${this.year})`,
      'Registration Number': this.registrationNumber,
      'Total Kilometers Travelled': `${this.odometerReading} km`,
      'Total services done': Service.getTotalServicesDone(this.services),
      'Revenue recorded': `$ ${Number.parseFloat(this.calculateRevenueRecorded()).toFixed(2)}`,
      'Kilometers since the last service': Number.parseFloat(Service.getLastServiceOdometerReading(this.services)) ? `${this.odometerReading - Service.getLastServiceOdometerReading(this.services)} km` : Service.getLastServiceOdometerReading(this.services),
      'Requires service': Service.requiresService(this.services) ? 'Yes' : 'No'
    })
  }

  calculateRevenueRecorded() {
    return this.bookings.reduce((total, b) => {
      if (Number.parseFloat(b.bookingCost)) {
        total += b.bookingCost;
      }
      return total;
	}, 0);
  }

  updateVehicleOdometer() {
	// get all journeys
	if (this.bookings.length) {
	  const journeys = this.bookings.reduce((j, b) => {
		if (b.journeys.length) {
		  j.push(...b.journeys);
		}
		return j;
	  }, []);

	  // if a journey is scheduled for today, update vehicle odometer
	  const todaysJourney = journeys.find(j => moment(j.journeyEndedAt).isSame(moment(), 'days'));

	  if (todaysJourney) {
		this.odometerReading = todaysJourney.journeyEndOdometerReading;

		// update vehicle on firebase
		const db = firebase.firestore();
		db
		  .collection('vehicles')
		  .doc(this.id)
		  .update({
			'_odometerReading': this.odometerReading,
			'_updatedAt': moment().format('DD/MM/YYYY hh:mm:ss a')
		  })
	  }
	}
  }
}
