const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/db.js");

const userRouter = require("./routers/userRouter.js");
const productRouter = require("./routers/productRouter.js")
const cartRouter = require("./routers/cartRouter.js")
const addressRouter = require("./routers/addressRouter.js")
const orderRoutes = require("./routers/orderRoutes.js")
const cors = require("cors")

const app = express();
connectDB();

app.use(express.json());
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}))

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) =>{
  res.send("API is running...")
})

app.listen(PORT, () =>{
  console.log(`Server is running on port ${PORT}`)
})