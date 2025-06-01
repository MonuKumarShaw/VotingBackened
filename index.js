// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const app = express();
// const authRoutes = require("./routes/auth");

// mongoose.connect("mongodb://localhost:27017/votingDB");

// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", authRoutes);

// app.listen(5000, () => console.log("Server running on port 5000"));

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const authRoutes = require("./auth");

const mongoURI = "mongodb+srv://monushaw580:Monu7980156406@voterdb.hoficdk.mongodb.net/votingDB?retryWrites=true&w=majority";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(5000, () => console.log("🚀 Server running on port 5000"));

