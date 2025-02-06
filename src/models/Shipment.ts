import mongoose, { Document, Schema } from 'mongoose';

//  interface for the Shipment document
interface IShipment extends Document {
  shipmentName: string;
  origin: string;
  destination: string;
  weight: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  createdAt: Date;
  updatedAt: Date;
}


const shipmentSchema: Schema = new Schema(
  {
    shipmentName: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered'], 
      default: 'Pending',
    },
  },
  {
    timestamps: true, 
  }
);

// Create and export the Shipment model
const Shipment = mongoose.model<IShipment>('Shipment', shipmentSchema);

export default Shipment;
