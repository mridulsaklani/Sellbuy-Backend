const mongoose = require("mongoose");

const ConnectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
            family: 4
        });
        console.log(`Database Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(" Database connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = ConnectDb;
