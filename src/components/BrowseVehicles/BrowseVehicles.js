import React from 'react';
import {Col, Container, Row} from 'react-bootstrap'
import {LoadingSpinner} from "../LoadingSpinner/LoadingSpinner";
import {AppConsumer} from "../../AppContext/AppContext";
import {Notification} from "../Notification/Notification";
import {DeleteResource} from "../DeleteResource/DeleteResource";
import {VehicleDetails} from "../ShowVehicle/VehicleDetails";

export const BrowseVehicles = props => {
  return (
    <AppConsumer>
      {
        ({loading, vehicles, notification}) => (
          <Container>
            {
              notification.display ?
                (
                  <Notification
                    display={notification.display}
                    message={notification.message}/>
                ) : ''
            }
            <Row>
              <Col>
                <h2 className="text-center my-5">Browse vehicles</h2>
              </Col>
            </Row>
            <DeleteResource/>
            {
              loading ?
                (
                  <Row className="justify-content-center mt-5">
                    <LoadingSpinner/>
                  </Row>
                ) :
                (
                  vehicles.map((v, i) => (
                    <VehicleDetails
                      key={i}
                      vehicle={v}
                    />
                  ))
                )
            }
          </Container>
        )
      }
    </AppConsumer>
  )
};
