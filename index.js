import { cyan, yellow } from 'console-log-colors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { corsOptions } from './config/corsOptions.js';
import { dbConnect } from './config/dbConnect.js';
import { credentials } from './middlewares/credentials.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import { verifyJWT } from './middlewares/verifyJWT.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.listen(process.env.EXPRESS_PORT, () =>
  console.log(yellow(`Server running on port ${process.env.EXPRESS_PORT}`)));

dbConnect();

mongoose.connection.once('open', () => {
  console.log(cyan('MongoDB connected successfully'));
});

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.use(verifyJWT);

app.use('/', userRoutes);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../FIGMA_E_COMMERCE_WEBSITE-Client', 'dist', 'index.html'))
  );
};

app.use(notFound);
app.use(errorHandler);

process.on('uncaughtException', function (err) {
  console.log(err);
});

