import mongoose from 'mongoose';
import './config';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, (err, client) => {
    if (err) {
        return console.log('Error connection with db: ' + err);
    }
    console.log('We have connection with DB!!!');
});