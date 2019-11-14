import moment from "moment";

export class Booking {
  _id;
  _vehicleID;
  _bookingType;
  _startDate;
  _endDate;
  _startOdometer;
  _createdAt;
  _updatedAt;

  constructor(id = require('uuid/v4')(), vehicleID, bookingType, startDate, endDate, startOdometer, createdAt = moment().format('DD/MM/YYYY hh:mm:ss A'), updatedAt = null) {
    this._id = id;
    this._vehicleID = vehicleID;
    this._bookingType = bookingType;
    this._startDate = startDate;
    this._endDate = endDate;
    this._startOdometer = startOdometer;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get vehicleID() {
    return this._vehicleID;
  }

  set vehicleID(value) {
    this._vehicleID = value;
  }

  get bookingType() {
    return this._bookingType;
  }

  set bookingType(value) {
    this._bookingType = value;
  }

  get startDate() {
    return this._startDate;
  }

  set startDate(value) {
    this._startDate = value;
  }

  get endDate() {
    return this._endDate;
  }

  set endDate(value) {
    this._endDate = value;
  }

  get startOdometer() {
    return this._startOdometer;
  }

  set startOdometer(value) {
    this._startOdometer = value;
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