require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const directorRoutes = require("./routes/directors");
const locationRoutes = require("./routes/locations");
const movieRoutes = require("./routes/movies");
const releaseRoutes = require("./routes/releaseYears");
const updateRoutes=require("./routes/update");

app.use(cors());

app.get("/", (req, res) => {
  res.send("API CALLS INCLUDE /MOVIES /LOCATIONS /DIRECTORS /RELEASEYEARS");
});

app.use("/",directorRoutes);
app.use("/",locationRoutes);
app.use("/",movieRoutes);
app.use("/",releaseRoutes);
app.use("/",updateRoutes);


const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Backend API running`);
  });