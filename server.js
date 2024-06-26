const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "sj19981220",
  database: "Shared_mobility",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL Connected...");
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
const mobilityRoutes = require("./routes/mobility");
const stationRoutes = require("./routes/station");
const userRoutes = require("./routes/user");
const supportRoutes = require("./routes/support");
const mo_editRoutes = require("./routes/mo_manage");



// Use routes
app.use("/api/mobility", mobilityRoutes(db));
app.use("/api/stations", stationRoutes(db));
app.use("/api/users", userRoutes(db));
app.use("/api/support", supportRoutes(db));
app.use("/api/mo_edit", mo_editRoutes(db));


// Serve HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/user.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "user.html"));
});

app.get("/edit_user.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "edit_user.html"));
});

app.get("/contact.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "support.html"));
});

app.get("/mobility.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "mobility.html"));
});

app.get("/mo_manage.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "mo_manage.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
