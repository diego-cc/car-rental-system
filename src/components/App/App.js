import React from 'react';
import {Navigation} from "../Navigation/Navigation";
import {Header} from "../Header/Header";
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
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import {ShowVehicle} from "../ShowVehicle/ShowVehicle";
import {Vehicle} from "../../Model/Vehicle";
import {Booking} from "../../Model/Booking";
import {Journey} from "../../Model/Journey";
import {Service} from "../../Model/Service";
import {FuelPurchase} from "../../Model/FuelPurchase";

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.editVehicle = vehicle => {
      this.setState({
        loading: true
      }, () => {
        this.setState(prevState => {
          const {vehicles} = {...prevState};
          const oldVehicleIndex = vehicles.findIndex(v => v.id === vehicle.id);
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
            .update({
              _id: vehicle.id,
              ...vehicle
            })
            .then(() => {
              this.setState({
                loading: false,
                notification: {
                  display: true,
                  message: `The vehicle has been successfully updated`
                }
              }, () => {
                setTimeout(() => {
                  this.setState({
                    notification: {
                      display: false,
                      message: ''
                    }
                  })
                }, 3500)
              })
            })
            .catch(err => {
              this.setState({
                loading: false,
                notification: {
                  display: true,
                  message: `Could not edit vehicle: ${err}`
                }
              }, () => {
                console.dir(err);
              })
            })
        });
      })
    };

    this.addResource = (resourceType, resource) => {
      if (!resourceType || !resource) {
        return this.setState({
          notification: {
            display: true,
            message: 'Error: missing resource or resource type'
          }
        })
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

      this.setState(prevState => {
        collection = collectionName && prevState[collectionName];
        if (!collection) {
          return ({
            notification: {
              display: true,
              message: 'Error: invalid resource type provided'
            }
          })
        }
        collection.push(resource);

        return ({
          loading: true,
          [collection]: collection
        })
      }, () => {
        if (collectionName && collection) {
          const db = firebase.firestore();
          db
            .collection(collectionName)
            .doc(resource.id)
            .set({...resource})
            .then(() => {
              this.setState({
                loading: false,
                notification: {
                  display: true,
                  message: `The new ${resourceType} has been successfully added to the system`
                }
              }, () => {
                setTimeout(() => {
                  this.setState({
                    notification: {
                      display: false,
                      message: ''
                    }
                  })
                }, 3500)
              })
            })
            .catch(err => {
              this.setState({
                loading: false,
                notification: {
                  display: true,
                  message: `Could not add new ${resourceType}. Error: ${err.message}`
                }
              }, () => {
                setTimeout(() => {
                  this.setState({
                    notification: {
                      display: false,
                      message: ''
                    }
                  })
                }, 3500)
              })
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
              db
                .collection(collection)
                .doc(resource.id)
                .delete()
                .then(() => {
                  this.setState(prevState => {
                    const updatedCollection = prevState[collection];
                    return ({
                      ...prevState,
                      loading: false,
                      notification: {
                        display: true,
                        message: `The ${resourceType} has been successfully removed from the system`
                      },
                      [collection]: updatedCollection.filter(r => r.id !== resource.id)
                    })
                  }, () => {
                    setTimeout(() => {
                      this.setState({
                        notification: {
                          display: false,
                          message: ''
                        }
                      })
                    }, 3000)
                  })
                })
                .catch(err => {
                  this.setState({
                    loading: false,
                    notification: {
                      display: true,
                      message: `Error: ${err.message}`
                    }
                  }, () => {
                    setTimeout(() => {
                      this.setState({
                        notification: {
                          display: false,
                          message: ''
                        }
                      })
                    }, 3000)
                  })
                })
            }
          })
        })
      }
    };

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

  componentDidMount() {
    this
      .fetchCollections('vehicles', 'services', 'bookings', 'journeys', 'fuelPurchases')
      .then(values => {
        // move services, bookings, journeys and fuel purchases to the respective vehicle
        const {services, bookings, journeys, fuelPurchases, vehicles} = this.state;
        /*vehicles.forEach(vehicle => {
          const vehicleServices = services.filter(s => s.vehicleID === vehicle.id);
          vehicleServices.forEach(s => vehicle.addService(s));

          const vehicleBookings = bookings.filter(b => b.vehicleID === vehicle.id);
          vehicleBookings.forEach(b => vehicle.addBooking(b));

          const vehicleJourneys = journeys.filter(j => vehicleBookings.some(b => j.bookingID === b.id));
          vehicleJourneys.forEach(j => vehicle.addJourney(j));

          const vehicleFuelPurchases = fuelPurchases.filter(f => vehicleBookings.some(b => b.id === f.bookingID));
          vehicleFuelPurchases.forEach(f => vehicle.addFuelPurchase(f));
        });*/
        // update vehicle odometers if a journey ends today
        const moment = extendMoment(Moment);
        journeys.forEach(journey => {
          const momentEndDate = moment(journey.journeyEndedAt);
          const now = moment();
          const selectedBooking = bookings.find(booking => booking.id === journey.bookingID);
          let selectedVehicle;
          if (selectedBooking) {
            selectedVehicle = vehicles.find(vehicle => vehicle.id === selectedBooking.vehicleID);
          }
          if (selectedVehicle && selectedBooking && momentEndDate.isSame(now) && (selectedVehicle.odometerReading < journey.journeyEndOdometerReading)) {
            this.setState(prevState => {
              const updatedVehicles = prevState.vehicles;
              updatedVehicles[vehicles.findIndex(vehicle => vehicle.id === selectedVehicle.id)].odometerReading = journey.journeyEndOdometerReading;

              return ({
                vehicles: updatedVehicles
              })
            }, () => {
              const db = firebase.firestore();
              db
                .collection('vehicles')
                .doc(`${selectedVehicle.id}`)
                .set({
                  ...selectedVehicle,
                  odometerReading: journey.journeyEndOdometerReading
                })
                .then(() => {
                  this.setState({
                    notification: {
                      display: true,
                      message: 'Successfully updated vehicle odometers'
                    }
                  }, () => {
                    setTimeout(() => {
                      this.setState({
                        notification: {
                          display: false,
                          message: ''
                        }
                      })
                    }, 3000)
                  })
                })
            })
          }
        })
      })
      .catch(err => {
        // display error message
        this.setState({
          notification: {
            display: true,
            message: `Error: ${err.message}`
          }
        }, () => {
          setTimeout(() => {
            this.setState({
              notification: {
                display: false,
                message: ''
              }
            })
          }, 3000)
        })
      })
  }

  fetchCollection = (collection, callback) => {
    const db = firebase.firestore();
    return db
      .collection(collection)
      .get()
      .then(querySnapshot => {
        let data = querySnapshot.docs.map(doc => doc.data());
        data = data.map(resource => {
          switch (collection.trim().toLowerCase()) {
            case 'vehicles':
              resource = new Vehicle(resource._manufacturer, resource._model, resource._year, resource._odometerReading, resource._registrationNumber, resource._tankCapacity, resource._id, resource._createdAt, resource._updatedAt);
              break;

            case 'bookings':
              resource = new Booking(resource._vehicleID, resource._bookingType, resource._startDate, resource._endDate, resource._startOdometer, resource._id, resource._createdAt, resource._updatedAt);
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

        this.setState({
          loading: false,
          [collection]: [...data]
        })
      })
      .then(callback)
      .catch(e => {
        this.setState({
          loading: false
        }, () => {
          console.dir(e);
        })
      })
  };

  async fetchCollections(...collections) {
    return Promise.all(collections.map(collection => this.fetchCollection(collection)))
  }

  render() {
    return (
      <AppProvider value={this.state}>
        <Navigation/>
        <Switch>
          <Route exact path="/">
            <Header headerText="Welcome to the Car Rental System"/>
          </Route>
          <Route path="/browse">
            <BrowseVehicles/>
          </Route>
          <Route path="/add" render={(props) => <AddVehicle {...props} />}/>
          <Route path="/show/:vehicleID" render={(props) => <ShowVehicle {...props} />}/>
          <Route path="/edit/:vehicleId" render={(props) => <EditVehicle {...props} />}/>
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
