import mongoose from 'mongoose';

const ProductSchema = mongoose.Schema(
  {
    url: String,
    newItem: Boolean,
    hotItem: Boolean,
    percent: Number | undefined,
    buttonLabel: String,
    name: String,
    description: String | undefined,
    price: Number,
    oldPrice: Number | undefined
  },
  { timestamps: true }
);

const ProductModel = mongoose.model('Products', ProductSchema);

export default ProductModel;
