const mongoose = require('mongoose');

async function connect() {
    try{
        await mongoose.connect(
            "mongodb+srv://vitals:mariukas@cluster0.lzfp2jc.mongodb.net/?retryWrites=true&w=majority",
            { useNewUrlParser: true }
        );
    } catch (err) {
        console.log(err);
        console.log("Error connecting to MongoDB");
    }
}

module.exports = { connect }