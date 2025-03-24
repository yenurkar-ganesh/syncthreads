const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const cors = require("cors");

const app = express();
app.use(express.json());

let db;

// Middleware
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// user login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.get(`SELECT * FROM users WHERE username = ?`, [
      username,
    ]);
    if (!user) {
      return res.status(400).send("Invalid User");
    }
    const validatePassword = bcrypt.compare(password, user.password);
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
  const { username, password, name } = req.body;
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

// get all cards
app.get("/api/cards", async (req, res) => {
  const cards = await db.all("select * from cards");
  if (!cards) {
    return res.status(400).status(`No cards found`);
  }
  return res.status(200).send(cards);
});

// Specific card details
app.get("/cards/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cardDetails = await db.get(`select * from cards where id=${id}`);
    if (!cardDetails) {
      return res.status(400).send(`Card details is not found`);
    }
    res.status(200).send(cardDetails);
  } catch (error) {
    console.error("Error while fetching card details ", error);
  }
});

// add card info
app.post("/api/new-card", async (req, res) => {
  const { type, title, description, data } = req.body;
  if (!type || !title || !data) {
    return res
      .status(400)
      .json({ error: "Type, title, and data are required." });
  }
  let dataString;
  try {
    dataString = JSON.stringify(data);
  } catch (error) {
    return res.status(400).json({ error: "Invalid JSON format in data." });
  }

  await db.run(
    "INSERT INTO cards (type, title, description, data) VALUES (?, ?, ?, ?)",
    [type, title, description || "", dataString],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).send("Card is created successfully.");
    }
  );
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
