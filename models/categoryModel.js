import mongoose from 'mongoose';

const categorySchema = mongoose.Schema(
  {
    url: String,
    name: String
  },
  { timestamps: true }
);

const categoryModel = mongoose.model('categorys', categorySchema);

export default categoryModel;
