import mongoose from 'mongoose';

const logoSchema = mongoose.Schema(
  {
    url: String
  },
  { timestamps: true }
);

const logoModel = mongoose.model('logos', logoSchema);

export default logoModel;
