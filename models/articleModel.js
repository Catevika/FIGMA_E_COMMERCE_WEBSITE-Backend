import mongoose from 'mongoose';

const articleSchema = mongoose.Schema(
  {
    articleUrl: String,
    title: String
  },
  { timestamps: true }
);

const articleModel = mongoose.model('articles', articleSchema);

export default articleModel;
