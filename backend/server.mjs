import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Example route to get restaurants along a route
app.get("/api/restaurants", async (req, res) => {
  const { start, destination } = req.query;

  try {
    // Call Google Directions API to get the optimal route
    const directionsResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json`,
      {
        params: {
          origin: start,
          destination: destination,
          key: process.env.GOOGLE_DIRECTIONS_API_KEY,
        },
      }
    );

    const waypoints =
      directionsResponse.data.routes[0].overview_polyline.points;

    // Call Google Places API to get restaurants near waypoints
    const restaurantsResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: waypoints[0], // use the first waypoint or iterate through all
          radius: 2000,
          type: "restaurant",
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );

    res.json({
      restaurants: restaurantsResponse.data.results,
    });
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
