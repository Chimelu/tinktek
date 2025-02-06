import Shipment from "../models/Shipment"; // Assuming you have a Shipment model

// Service to create a new shipment in the database
export const createShipmentService = async (shipmentData: any) => {
  try {
    // Create a new shipment document in the database
    const newShipment = new Shipment(shipmentData);
    await newShipment.save();
    return newShipment;
  } catch (error) {
    throw new Error("Error saving shipment");  
  }
};
