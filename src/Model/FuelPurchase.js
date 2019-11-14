import moment from "moment";

export class FuelPurchase {
  _id;
  _bookingID;
  _createdAt;
  _fuelPrice;
  _fuelQuantity;
  _updatedAt;

  constructor(id = require('uuid/v4')(), bookingID, fuelQuantity, fuelPrice, createdAt = moment().format('DD/MM/YYYY hh:mm:ss A'), updatedAt = null) {
    this._id = id;
    this._bookingID = bookingID;
    this._fuelPrice = fuelPrice;
    this._fuelQuantity = fuelQuantity;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get bookingID() {
    return this._bookingID;
  }

  set bookingID(value) {
    this._bookingID = value;
  }

  get fuelQuantity() {
    return this._fuelQuantity;
  }

  set fuelQuantity(value) {
    this._fuelQuantity = value;
  }

  get fuelPrice() {
    return this._fuelPrice;
  }

  set fuelPrice(value) {
    this._fuelPrice = value;
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
}
