const mongoose = require('mongoose');

const URI = 'mongodb+srv://pademarcos:pepe123@cluster0.78u7feb.mongodb.net/';


mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});


const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connected successfully");
});