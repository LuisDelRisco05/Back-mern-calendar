const mongoose = require("mongoose");

const dbConnection = async() => {

    try {

        mongoose.connect( process.env.DB_CNN );

        console.log('DB Online');

        
    } catch (error) {
        console.log(error);
        throw new Error("Couldn't connect to the database.");
        
    }

};

module.exports = {
    dbConnection
}