import React from 'react';
import {Navigation} from "../Navigation/Navigation";
import {Header} from "../Header/Header";
import {BrowseVehicles} from "../BrowseVehicles/BrowseVehicles";
import {Switch, Route} from 'react-router-dom';
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

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.addVehicle = vehicle => {
      this.setState({
        loading: true
      }, () => {
        // TODO: Validate fields before submission
        /*Object.values(vehicle).some(value => value.trim() && ...)
        let emptyField = false;
        for(let field in this.state) {
          ...
        }*/
        const {vehicles} = this.state;
        const vehicleId = require('uuid/v4')();
        vehicles.push({
          id: vehicleId,
          ...vehicle
        });
        this.setState({
          vehicles
        }, () => {
          const db = firebase.firestore();
          db
            .collection('vehicles')
            .doc(vehicleId)
            .set({
              id: vehicleId,
              ...vehicle
            })
            .then(() => {
              this.setState({
                notification: {
                  display: true,
                  message: 'The vehicle has been successfully added to the system'
                },
                loading: false
              }, () => {
                setTimeout(() => {
                  this.setState({
                    notification: {
                      display: false,
                      message: ''
                    }
                  });
                }, 3500)
              })
            })
            .catch(e => {
              this.setState({
                loading: false,
                notification: {
                  display: true,
                  message: 'The vehicle could not be added to the system. Please try again.'
                }
              }, () => {
                console.dir(e);
                setTimeout(() => {
                  this.setState({
                    notification: {
                      display: false,
                      message: ''
                    }
                  });
                }, 3500)
              })
            });
        })
      })
    };

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
              id: vehicle.id,
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

    this.confirmDeleteVehicle = vehicleId => {
      this.setState({
        loading: true
      }, () => {
        const filteredVehicles = this.state.vehicles.filter(vehicle => vehicle.id !== vehicleId);
        this.setState({
          vehicles: filteredVehicles
        }, () => {
          const db = firebase.firestore();
          return db
            .collection('vehicles')
            .doc(vehicleId)
            .delete()
            .then(() => {
              this.setState(prevState => ({
                loading: false,
                deleteVehicle: {
                  ...prevState.deleteVehicle,
                  showDeleteModal: false
                },
                notification: {
                  display: true,
                  message: 'The vehicle has been successfully deleted from the system'
                }
              }), () => {
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
              this.setState(prevState => ({
                notification: {
                  loading: false,
                  deleteVehicle: {
                    ...prevState.deleteVehicle,
                    showDeleteModal: false
                  },
                  display: true,
                  message: `The vehicle could not be deleted. Error: ${err}`
                }
              }), () => {
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
        })
      })
    };

    this.setDeleteModalShow = vehicleId => {
      this.setState(prevState => ({
        deleteVehicle: {
          ...prevState.deleteVehicle,
          selectedVehicleId: vehicleId ? vehicleId : null,
          showDeleteModal: !prevState.deleteVehicle.showDeleteModal
        }
      }));
    };

    this.addBooking = booking => {
      const bookingID = require('uuid/v4')();
      const updatedBooking = {
        ...booking,
        id: bookingID
      };
      this.setState(prevState => {
        const {bookings} = prevState;
        bookings.push(updatedBooking);
        return ({
          loading: true,
          bookings
        })
      }, () => {
        const db = firebase.firestore();
        db
          .collection('bookings')
          .doc(bookingID)
          .set(updatedBooking)
          .then(() => {
            this.setState({
              loading: false,
              notification: {
                display: true,
                message: `The new booking has been successfully registered in the system`
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
                message: `Could not register new booking. Error: ${err}`
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
      })
    };

    this.addJourney = journey => {
      const journeyID = require('uuid/v4')();
      const updatedJourney = {
        ...journey,
        id: journeyID,
        createdAt: new Date().toLocaleString('en-AU'),
        updatedAt: null
      };

      this.setState(prevState => {
        const {journeys} = prevState;
        journeys.push(updatedJourney);
        return ({
          loading: true,
          journeys
        })
      }, () => {
        const db = firebase.firestore();
        db
          .collection('journeys')
          .doc(journeyID)
          .set(updatedJourney)
          .then(() => {
            this.setState({
              loading: false,
              notification: {
                display: true,
                message: `The new journey has been successfully registered in the system`
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
                message: `Could not register new journey. Error: ${err}`
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
      })
    };

    this.addService = service => {
      const serviceID = require('uuid/v4')();
      const updatedService = {
        ...service,
        id: serviceID
      };
      this.setState(prevState => {
        const {services} = prevState;
        services.push(updatedService);
        return ({
          loading: true,
          services
        })
      }, () => {
        const db = firebase.firestore();
        db
          .collection('services')
          .doc(serviceID)
          .set(updatedService)
          .then(() => {
            this.setState({
              loading: false,
              notification: {
                display: true,
                message: `The new service has been successfully registered in the system`
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
                message: `Could not register new service. Error: ${err}`
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
      })
    };

    this.addFuelPurchase = fuelPurchase => {
	  const fuelPurchaseID = require('uuid/v4')();
	  const updatedFuelPurchase = {
		...fuelPurchase,
		id: fuelPurchaseID
	  };
	  this.setState(prevState => {
		const {fuelPurchases} = prevState;
		fuelPurchases.push(updatedFuelPurchase);
		return ({
		  loading: true,
		  fuelPurchases
		})
	  }, () => {
		const db = firebase.firestore();
		db
		  .collection('fuelPurchases')
		  .doc(fuelPurchaseID)
		  .set(updatedFuelPurchase)
		  .then(() => {
			this.setState({
			  loading: false,
			  notification: {
				display: true,
				message: `The fuel purchase has been successfully registered in the system`
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
				message: `Could not register new fuel purchase. Error: ${err}`
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
	  })
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
      deleteVehicle: {
        selectedVehicleId: null,
        confirmDeleteVehicle: this.confirmDeleteVehicle,
        showDeleteModal: false,
        setDeleteModalShow: this.setDeleteModalShow
      },
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
	    // notify user that all collections have been successfully loaded
	  })
	  .catch(err => {
	    // display error message
	  })
  }

  fetchCollection = (collection, callback) => {
    const db = firebase.firestore();
    db
      .collection(collection)
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
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
          <Route path="/edit/:vehicleId" render={(props) => <EditVehicle {...props} />}/>
          <Route path="/addBooking/:vehicleID" render={(props) => <AddBooking {...props} />}/>
          <Route path="/addJourney/:vehicleID" render={(props) => <AddJourney {...props} />}/>
          <Route path="/addJourneyForm/:bookingID" render={(props) => <AddJourneyForm {...props} />}/>
          <Route path="/addService/:vehicleID" render={(props) => <AddService {...props} />}/>
		  <Route path="/addFuelPurchase/:vehicleID" render={(props) => <AddFuelPurchase {...props} />}/>
		  <Route path="/addFuelPurchaseForm/:bookingID" render={(props) => <AddFuelPurchaseForm {...props} />}/>
          <Route path="*" render={(props) => <BrowseVehicles {...props}/>}/>
        </Switch>
      </AppProvider>
    )
  }
}
