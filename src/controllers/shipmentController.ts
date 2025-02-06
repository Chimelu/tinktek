import { Request, Response } from "express";
import { createShipmentService } from "../services/shipmentService";

// Controller to create a new shipment 
export const createShipment = async (req: Request, res: Response) => {
  try {
    // passing the shipment data from req.body
    const shipmentData = req.body;
    const newShipment = await createShipmentService(shipmentData);
    res.status(201).json(newShipment);
  } catch (error:any) {
    res.status(500).json({ message: "Error creating shipment", error: error.message });
  }
};
