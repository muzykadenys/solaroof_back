require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
var cors = require('cors')
const userRouter = require('./routes/userRouter')
const systemListRouter = require('./routes/systemListRouter')
const analyticsRouter = require('./routes/analyticsRouter')


const app = express();
app.use(cors());
app.use(express.json());


async function connectMongoose() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connect to mongoDB!");
  } catch (e) {
    console.log("Connection to MongoDB error:", e.message);
  }
}
connectMongoose();

app.use('/user', userRouter)
app.use('/systemList', systemListRouter)
app.use('/analytics', analyticsRouter)


app.listen(3000, () => console.log("server started"));
