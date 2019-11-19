/**
 * Vehicle.js
 */
import moment from "moment";
import {Service} from "./Service";
import {firebase} from "../Firebase/Firebase";

/**
 * Vehicle model class
 * @class
 */
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


  /**
   * Creates a new Vehicle
   * @param {string} manufacturer - manufacturer brand of this vehicle
   * @param {string} model - model of this vehicle
   * @param {number} year - year of this vehicle
   * @param {number} odometerReading - odometer reading of this vehicle
   * @param {string} registrationNumber - registration number of this vehicle
   * @param {number} tankCapacity - tank capacity of this vehicle
   * @param {string} id - ID of this vehicle
   * @param {string} createdAt - timestamp generated when this vehicle is created
   * @param {string|null} updatedAt - timestamp generated when this vehicle is updated
   */
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

  /**
   * Adds a new booking to {@link bookings}
   * @param {Booking} newBooking - new booking to be added to {@link bookings}
   */
  addBooking(newBooking) {
	this.bookings.push(newBooking);
  }

  /**
   * Removes a booking from {@link bookings} by its ID
   * @param {string} bookingID - the ID of the booking to be removed
   */
  removeBookingByID(bookingID) {
	if (bookingID) {
	  const bookingsCopy = [...this.bookings];
	  const bookingToBeDeleted = bookingsCopy.find(booking => booking.id === bookingID);

	  if (bookingToBeDeleted) {
		this.bookings = bookingsCopy.filter(booking => booking.id !== bookingToBeDeleted.id);
	  }
	}
  }

  /**
   * Removes a journey from {@link journeys} by its associated bookingID
   * @param {Journey} journey - the journey to be removed
   * @param {string} bookingID - the ID of the booking that contains the journey to be removed
   */
  removeJourneyByBookingID(journey, bookingID) {
	this.bookings.find(b => b.id === bookingID).removeJourney(journey);
  }

  /**
   * Adds a new journey to {@link journeys}
   * @param {Journey} newJourney - the new journey to be added
   */
  addJourney(newJourney) {
	this.bookings.find(b => b.id === newJourney.bookingID).addJourney(newJourney);
  }

  /**
   * Adds a new service to {@link services}
   * @param {Service} newService - new service to be added
   */
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

  /**
   * Returns an object that contains all details of this vehicle in a readable format
   * @returns {{Vehicle: string, "Revenue recorded": string, "Kilometers since the last service": (string|*), "Requires service": (string), "Total services done": *, "Total Kilometers Travelled": string, "Registration Number": *}}
   */
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

  /**
   * Calculates total revenue associated with this vehicle based on its bookings
   * @returns {number} totalRevenue - total revenue recorded for this vehicle
   */
  calculateRevenueRecorded() {
	return this.bookings.reduce((total, b) => {
	  if (Number.parseFloat(b.bookingCost)) {
		total += b.bookingCost;
	  }
	  return total;
	}, 0);
  }

  /**
   * Updates this vehicle's odometer based on its journeys
   * @param {Function} callback - runs after the vehicle has been updated on firebase
   */
  updateVehicleOdometer(callback) {
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

	  if (todaysJourney && todaysJourney.journeyEndOdometerReading > this.odometerReading) {
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
		  .then(callback)
		  .catch(console.dir)
	  }
	}
  }
}
