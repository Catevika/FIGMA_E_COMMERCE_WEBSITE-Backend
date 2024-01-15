import mongoose from 'mongoose';

const newsFeedImageSchema = mongoose.Schema(
  {
    url: String
  },
  { timestamps: true }
);

const newsFeedImageModel = mongoose.model('newsFeedImages', newsFeedImageSchema);

export default newsFeedImageModel;
