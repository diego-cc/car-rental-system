import React from 'react';
import {Navigation} from "../Navigation/Navigation";
import {Header} from "../Header/Header";
import {BrowseVehicles} from "../BrowseVehicles/BrowseVehicles";
import {Switch, Route} from 'react-router-dom';
import {AddVehicle} from "../AddVehicle/AddVehicle";

export class App extends React.Component {
    render() {
        return (
            <>
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
                </Switch>
            </>
        )
    }
}
