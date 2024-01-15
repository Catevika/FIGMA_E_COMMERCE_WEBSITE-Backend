import mongoose from 'mongoose';

const ServiceSchema = mongoose.Schema(
  {
    iconUrl: String,
    title: String,
    description: String
  },
  { timestamps: true }
);

const ServiceModel = mongoose.model('Services', ServiceSchema);

export default ServiceModel;
