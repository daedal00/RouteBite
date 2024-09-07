import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Update the route to combine route and restaurant data
app.get("/api/route-and-restaurants", async (req, res) => {
  const { start, destination } = req.query;
  console.log(
    `Received request with start: ${start}, destination: ${destination}`
  );

  try {
    console.log("Calling Google Directions API...");
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
    console.log("Received response from Google Directions API");

    const route = directionsResponse.data.routes[0];
    const waypoints = route.legs[0].steps.map((step) => step.end_location);

    console.log(
      `Calling Google Places API for ${waypoints.length} waypoints...`
    );
    const restaurantsPromises = waypoints.map((waypoint) =>
      axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        {
          params: {
            location: `${waypoint.lat},${waypoint.lng}`,
            radius: 2000,
            type: "restaurant",
            key: process.env.GOOGLE_PLACES_API_KEY,
          },
        }
      )
    );

    const restaurantsResponses = await Promise.all(restaurantsPromises);
    console.log("Received responses from Google Places API");

    const restaurants = Array.from(
      new Map(
        restaurantsResponses
          .flatMap((response) => response.data.results)
          .map((restaurant) => [restaurant.place_id, restaurant])
      ).values()
    );

    console.log(`Found ${restaurants.length} unique restaurants`);

    console.log("Calculating detour times using Distance Matrix API...");
    const detourPromises = restaurants.map((restaurant) =>
      axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
        params: {
          origins: start,
          destinations: `${restaurant.geometry.location.lat},${restaurant.geometry.location.lng}|${destination}`,
          key: process.env.GOOGLE_DISTANCE_MATRIX_API_KEY,
        },
      })
    );

    const detourResponses = await Promise.all(detourPromises);
    console.log("Received responses from Distance Matrix API");

    const restaurantsWithDetour = restaurants.map((restaurant, index) => {
      const detourTime =
        detourResponses[index].data.rows[0].elements[0].duration.value +
        detourResponses[index].data.rows[0].elements[1].duration.value -
        route.legs[0].duration.value;
      return { ...restaurant, detourTime };
    });

    const sortedRestaurants = restaurantsWithDetour
      .sort((a, b) => a.detourTime - b.detourTime)
      .slice(0, 10);

    console.log(
      `Sending response with ${sortedRestaurants.length} sorted restaurants`
    );
    res.json({
      route: directionsResponse.data,
      restaurants: sortedRestaurants,
    });
  } catch (err) {
    console.error("Error fetching route and restaurants:", err);
    res.status(500).json({ error: "Failed to fetch route and restaurants" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
