import {Vehicle} from "./Vehicle";

export const VehicleStarter = () => {
  const v = new Vehicle("Ford", "T812", 2014);

  v.addFuel(Math.random() * 11, 1.3);
  v.printDetails();
};
