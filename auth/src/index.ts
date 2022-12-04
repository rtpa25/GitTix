import 'express-async-errors';

import mongoose from 'mongoose';
import { app } from './app';

const bootstrap = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error);
    }
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
};

bootstrap();
