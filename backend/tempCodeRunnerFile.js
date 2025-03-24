const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose(); // Correct import
const { open } = require("sqlite");
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Database connection
let db = null;

const initializeDatabase = async () => {
  try {
    db = await open({
      filename: "./database.db", // Correct path to the database
      driver: sqlite3.Database,
    });

    // Start the server after DB is connected
    app.listen(3000, () => {
      console.log(`✅ Server is running on http://localhost:3000`);
    });
    console.log(`✅ Database connected successfully!`);
  } catch (error) {
    console.error(`❌ Error while connecting to DB:`, error.message);
  }
};

initializeDatabase();
