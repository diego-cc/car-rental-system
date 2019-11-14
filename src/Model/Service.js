import moment from "moment";

export class Service {
  _id;
  _vehicleID;
  _serviceOdometer;
  _servicedAt;
  _createdAt;
  _updatedAt;

  constructor(vehicleID, serviceOdometer, servicedAt, id = require('uuid/v4')(), createdAt = moment().format('DD/MM/YYYY hh:mm:ss A'), updatedAt = null) {
    this._id = id;
    this._vehicleID = vehicleID;
    this._serviceOdometer = serviceOdometer;
    this._servicedAt = servicedAt;
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

  get serviceOdometer() {
    return this._serviceOdometer;
  }

  set serviceOdometer(value) {
    this._serviceOdometer = value;
  }

  get servicedAt() {
    return this._servicedAt;
  }

  set servicedAt(value) {
    this._servicedAt = value;
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
