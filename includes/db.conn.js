// db.js

const mongoose = require('mongoose');

// Define the MongoDB connection URL. By default, MongoDB runs on localhost at port 27017.
const mongoDBUrl = process.env.DATABASE_STRING;

// Connect to MongoDB
mongoose.connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Create a reference to the MongoDB connection
const db = mongoose.connection;

// Handle MongoDB connection events
db.on('connected', () => {
  console.log(`Connected to MongoDB at ${mongoDBUrl}`);
});

db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

db.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

// Export the MongoDB connection
module.exports = db;