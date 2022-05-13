const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserModel = require("../models/userModel");

const router = Router();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
// router.post('/generate', (req, res, next)) => {
//   let jwtSecretKey = process.env.JWT_SECRET_KEY;
//   let data = {
//     time: Date(),
//     userId: 12,
//   };

//   const token = jwt.sign(data, jwtSecretKey);

//   res.send(token);
// }

router.get("/", authenticateToken, (req, res, next) => {
  res.json({ message: "got authed" });
});

router.post("/regester", (req, res, next) => {
  // sanitize user input
  console.log(req.body.password);
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    if (err) {
      console.log("GOT HASHING ERROR");
    }
    console.log(hash);
  });
  // const user = new UserModel();
});

router.post("/", async (req, res, next) => {
  console.log(req.body);
  try {
    console.log("got here gracefully");
    const saltRounds = 1;
    const salt = bcrypt.genSaltSync(saltRounds);
    const pass = bcrypt.hashSync(req.body.password, salt);
    // TODO some backend data sanitization must happen
    obj = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: pass,
      org: req.body.org,
    };
    const NewUser = new UserModel(obj);
    const createdUser = await NewUser.save();
    console.log(createdUser);
    res.json(createdUser);
  } catch (error) {
    if (error.name === "Regestry Error") {
      res.status(422);
    }
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  //   try {
  //     const entries = await LogEntry.find();
  //     res.json(entries);
  //   } catch (error) {
  //     next(error);
  //   }
  //  get the user from the req.body
  try {
    console.log(req.body);
    const user = await UserModel.findOne({ email: req.body.email });
    bcrypt.compareSync(req.body.password, user.password);
    console.log("Authenticated", user);
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    console.log("Authenticated");

    res.setHeader("Authorization", `Bearer ${accessToken}`);
    res.redirect("http://localhost:8000/");
  } catch (error) {
    console.log("PLEASE GOD DONOT MAKE ERROR HERE");
    next(error);
  }
});

module.exports = { router, authenticateToken };
