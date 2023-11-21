import express from "express";
import session from "express-session";
import passport from "passport";
import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import { login, profile } from "./controllers/authController";
import { register } from "./controllers/userController";
import path from "path";
import { initializeDatabase } from "./data-source";

const app = express();
const port = 3000;



app.use(express.static(path.join(__dirname, 'views', 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: "your-secret-key", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "public", "index.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "public", "registration.html"));
});

app.post("/register", async (req, res) => {
  try {
    await register(req, res);
    res.redirect("/login");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "public", "login.html"));
});

app.post("/login", login);
app.get("/profile", profile);

initializeDatabase()
  .then(() => {
    console.log("Connected to the database");
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => console.error("Error connecting to database:", error));
