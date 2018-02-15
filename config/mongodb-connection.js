import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/UserJwt', (err, client) => {
    if(err) {
        return console.log('Error connection with db: ' + err);
    }
    console.log('We have connection with DB!!!');
});