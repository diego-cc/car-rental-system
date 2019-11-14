import moment from "moment";
import {calculateRevenueRecorded} from "../BookingCost";
import { Service } from "./Service";

export class Vehicle {
  _id;
  _manufacturer;
  _model;
  _year;
  _odometerReading;
  _registrationNumber;
  _tankCapacity;
  _bookings = [];
  _journeys = [];
  _services = [];
  _fuelPurchases = [];
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

  addJourney(newJourney) {
    this.journeys.push(newJourney);
  }

  removeJourneyByID(journeyID) {
    if (journeyID) {
      const journeysCopy = [...this.journeys];
      const journeyToBeDeleted = journeysCopy.find(journey => journey.id === journeyID);

      if (journeyToBeDeleted) {
        this.journeys = journeysCopy.filter(journey => journey.id !== journeyToBeDeleted.id);
      }
    }
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
    this.fuelPurchases.push(newFuelPurchase);
  }

  removeFuelPurchaseByID(fuelPurchaseID) {
    if (fuelPurchaseID) {
      const fuelPurchasesCopy = [...this.fuelPurchases];
      const fuelPurchaseToBeDeleted = fuelPurchasesCopy.find(fuelPurchase => fuelPurchase.id === fuelPurchaseID);

      if (fuelPurchaseToBeDeleted) {
        this.fuelPurchases = fuelPurchasesCopy.filter(
          fuelPurchase => fuelPurchase.id !== fuelPurchaseToBeDeleted.id
        );
      }
    }
  }

  get bookings() {
    return this._bookings;
  }

  set bookings(value) {
    this._bookings = value;
  }

  get journeys() {
    return this._journeys;
  }

  set journeys(value) {
    this._journeys = value;
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
      'Revenue recorded': `$ ${calculateRevenueRecorded(this.bookings, this.journeys)}`,
      'Kilometers since the last service': Number.parseFloat(Service.getLastServiceOdometerReading(this.services)) ? `${this.odometerReading - Service.getLastServiceOdometerReading(this.services)} km` : Service.getLastServiceOdometerReading(this.services),
      'Requires service': Service.requiresService(this.services) ? 'Yes' : 'No'
    })
  }
}