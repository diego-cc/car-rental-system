import React from 'react';
import {VehicleStarter} from "../../VehicleStarter";

export class App extends React.Component {
    render() {
        return (
            <div>
                <h1>Welcome to the Car Rental System</h1>
                <p>Car details:</p>
                { VehicleStarter() }
            </div>
        )
    }
}