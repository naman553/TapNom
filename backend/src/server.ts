import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import collegeRoutes from "./routes/collegeRoutes"
import canteenRoutes from "./routes/canteenRoutes";
import categoryRoutes from "./routes/categoryRoutes"
import menuItemRoutes from "./routes/menuItemRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    message: "Canteen API is running 🚀"
  });
});



app.use("/api/colleges" , collegeRoutes);
app.use("/api/canteens", canteenRoutes);


const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

};

startServer();