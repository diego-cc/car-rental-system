import React from 'react';
import {Navigation} from "../Navigation/Navigation";
import {Header} from "../Header/Header";
import {BrowseVehicles} from "../BrowseVehicles/BrowseVehicles";
import {Switch, Route} from 'react-router-dom';
import {AddVehicle} from "../AddVehicle/AddVehicle";
import {firebase} from "../../Firebase/Firebase";
import {AppProvider} from "../../AppContext/AppContext";
import {EditVehicle} from "../EditVehicle/EditVehicle";

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
                    data: vehicle
                });
                this.setState({
                    vehicles
                }, () => {
                    const db = firebase.firestore();
                    db
                        .collection('vehicles')
                        .doc(`${vehicle.manufacturer}_${vehicle.model}_${vehicle.year}_${vehicle.registrationNumber}`)
                        .set({
                            id: vehicleId,
                            data: vehicle
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
            const oldVehicle = this.state.vehicles.find(v => v.id === vehicle.id);

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
                        .doc(`${oldVehicle.data.manufacturer}_${oldVehicle.data.model}_${oldVehicle.data.year}_${oldVehicle.data.registrationNumber}`)
                        .update({
                            data: vehicle.data
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

        this.state = {
            loading: true,
            vehicles: [],
            addVehicle: this.addVehicle,
            editVehicle: this.editVehicle,
            notification: {
                display: false,
                message: ''
            }
        };
    }

    componentDidMount() {
        const db = firebase.firestore();
        db
            .collection('vehicles')
            .get()
            .then(querySnapshot => {
                const data = querySnapshot.docs.map(doc => doc.data());
                this.setState({
                    loading: false,
                    vehicles: [...data]
                })
            })
            .catch(e => {
                this.setState({
                    loading: false
                }, () => {
                    console.dir(e);
                })
            })
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
                    <Route path="/add">
                        <AddVehicle/>
                    </Route>
                    <Route path="/edit/:vehicleId" render={(props) => <EditVehicle {...props} />}/>
                </Switch>
            </AppProvider>
        )
    }
}
