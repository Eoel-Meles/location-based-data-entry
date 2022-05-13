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
  const saltRounds = 1;
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    if (err) {
      console.log("GOT HASHING ERROR");
    }
    console.log(hash);
  });
  // const user = new UserModel();
});

router.post("/", async (req, res, next) => {
  //   try {
  //     const entries = await LogEntry.find();
  //     res.json(entries);
  //   } catch (error) {
  //     next(error);
  //   }
  //  get the user from the req.body

  const username = req.body.username;
  const user = UserModel.findOne({ username: username }, function (err) {
    console.log("INTERNAL ERROR", err);
  });
  // check the password of the user

  // bcrypt.compare(req.body.paswword, user.password, function (err, result) {
  //   if (err)
  //      res.status(401).json("error": "incorrect password");
  // });

  //check the user from the database here

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });

  // if they got authenticated
  // then use their email/username to search
  // them from the database and give them the data
  // the must possess.
  // database.filter("usernme/email")
  // then send the markers nd related data to them
  // change the api file so it gets authenticated.
  // this means we need to add the auth middleware
  // to some pages
});

module.exports = { router, authenticateToken };
