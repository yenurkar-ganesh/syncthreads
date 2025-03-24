const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
app.use(express.json());

let db;

// Middleware
app.use(express.json());

// user login
app.post("/login", async (req, res) => {
  const { username, password } = req.query; 
  try {
    const user = await db.get(`SELECT * FROM users WHERE username = ?`, [
      username,
    ]);
    if (!user) {
      return res.status(400).send("Invalid User");
    }
    const validatePassword =  bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return res.status(400).send("Invalid Password");
    }
    const token = jwt.sign({ userId: user.id }, "SECRET_KEY", {
      expiresIn: "1h",
    });
    res.json({ jwtToken: token });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).send("Internal server error");
  }
});

// Register user
app.post("/register", async (req, res) => {
  const { username, password, name } = req.query;
  try {
    const isUserExist = await db.get(`SELECT * FROM users WHERE username = ?`, [
      username,
    ]);
    if (isUserExist) {
      return res.status(400).send("User already exists");
    }
    const hashedPassword = bcrypt.hash(password, 10);
    await db.run(
      `INSERT INTO users (username, password, name) VALUES (?, ?, ?)`,
      [username, hashedPassword, name]
    );
    res.status(201).send("User created successfully");
  } catch (error) {
    console.error(` Error while creating user:`, error.message);
    res.status(500).send("Internal server error");
  }
});

const initializeDatabase = async () => {
  try {
    db = await open({
      filename: "./database.db",
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log(`Server is running on http://localhost:3000`);
    });
    console.log(` Database connected successfully!`);
  } catch (error) {
    console.error(`Error while connecting to DB:`, error.message);
  }
};

initializeDatabase();
