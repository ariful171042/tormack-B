require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");

const app = express();

//middlewares
app.use(
  cors({
    Credential: true,
  })
);

app.use(express.json());

//routers
app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome to Tormack Server" });
});

app.use("/api/auth/user", userRoutes);

const port = process.env.PORT || 8000;

const uri = process.env.MONGO_URI;

//mongoose
mongoose.connect(uri, { useUnifiedTopology: true }).then(() => {
  app.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
});
