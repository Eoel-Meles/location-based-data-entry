const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const middlewares = require("./middlewares");
const logs = require("./api/logs");
const { router, authenticateToken } = require("./api/auth");

const app = express();

app.enable("trust proxy"); // needed for rate limiting by Client IP

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(morgan("common"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", authenticateToken, async (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

app.use("/api/logs", logs);
app.use("/api/auth", router);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
