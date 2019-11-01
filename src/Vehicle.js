import {FuelPurchase} from "./FuelPurchase";

/**
 * Vehicle class
 */
export class Vehicle {
  /**
   * @
   */
  _manufacturer;
  _model;
  _makeYear;
  _registrationNumber;
  _odometerReading;
  _tankCapacity;
  _fuelPurchase;

  getManufacturer() {
	return this._manufacturer;
  }

  getModel() {
	return this._model;
  }

  getMakeYear() {
	return this._makeYear
  }

  getRegistrationNumber() {
	return this._registrationNumber;
  }

  getOdometerReading() {
	return this._odometerReading;
  }

  setOdometerReading(odometerReading) {
	this._odometerReading = odometerReading;
  }

  setTankCapacity(tankCapacity) {
	this._tankCapacity = tankCapacity;
  }

  getTankCapacity() {
	return this._tankCapacity;
  }

  getFuelPurchase() {
	return this._fuelPurchase;
  }

  /**
   * Constructor for vehicle
   * @param {string} manufacturer Name of the manufacturer of the vehicle
   * @param {string} model Name of the model of the vehicle
   * @param {number} makeYear Year when the vehicle was built
   */
  constructor(manufacturer, model, makeYear) {
	this._manufacturer = manufacturer;
	this._model = model;
	this._makeYear = makeYear;
	this._fuelPurchase = new FuelPurchase();
  }

  /**
   * Print details about a {@link Vehicle}
   */
  printDetails() {
	console.dir({
	  manufacturer: this.getManufacturer(),
	  makeYear: this.getMakeYear(),
	  model: this.getModel(),
	  registrationNumber: this.getRegistrationNumber(),
	  tankCapacity: this.getTankCapacity(),
	  fuelPurchase: this.getFuelPurchase()
	})
  }

  /**
   * Adds distance travelled to the current {@link _odometerReading}
   * @param {number} distanceTravelled Distance travelled in km
   */
  addKilometres(distanceTravelled) {
	this.setOdometerReading(this.getOdometerReading() + distanceTravelled);
  }

  /**
   * Adds fuel to the car
   * @param {number} litres Litres of fuel to be added to the car
   * @param {number} price Price per litre of fuel
   */
  addFuel(litres, price) {
	this.getFuelPurchase().purchaseFuel(litres, price);
  }
}
