import React from 'react';
import {Navigation} from "../Navigation/Navigation";
import {Header} from "../Header/Header";
import {BrowseVehicles} from "../BrowseVehicles/BrowseVehicles";
import {Switch, Route} from 'react-router-dom';
import {AddVehicle} from "../AddVehicle/AddVehicle";
import {firebase} from "../../Firebase/Firebase";

export class App extends React.Component {
    state = {
        loading: true,
        vehicles: []
    };

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
            <>
                <Navigation/>
                <Switch>
                    <Route exact path="/">
                        <Header headerText="Welcome to the Car Rental System"/>
                    </Route>
                    <Route path="/browse">
                        <BrowseVehicles
                            loading={this.state.loading}
                            vehicles={this.state.vehicles}/>
                    </Route>
                    <Route path="/add">
                        <AddVehicle/>
                    </Route>
                </Switch>
            </>
        )
    }
}
