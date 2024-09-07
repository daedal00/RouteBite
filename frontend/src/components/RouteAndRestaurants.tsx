import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";

interface Restaurant {
  name: string;
  vicinity: string;
  rating: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

const RouteAndRestaurantsMap: React.FC = () => {
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [start, setStart] = useState<string>("New York, NY");
  const [destination, setDestination] = useState<string>("Boston, MA");
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  const fetchRouteAndRestaurants = useCallback(async () => {
    try {
      const response = await axios.get<{
        route: google.maps.DirectionsResult;
        restaurants: Restaurant[];
      }>("/api/route-and-restaurants", {
        params: { start, destination },
      });
      setDirectionsResponse(response.data.route);
      setRestaurants(response.data.restaurants);
    } catch (error) {
      console.error("Error fetching route and restaurants:", error);
    }
  }, [start, destination]);

  useEffect(() => {
    if (start && destination) {
      fetchRouteAndRestaurants();
    }
  }, [start, destination, fetchRouteAndRestaurants]);

  return (
    <div>
      <div>
        <input
          type="text"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="Enter start location"
        />
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination"
        />
        <button onClick={fetchRouteAndRestaurants}>
          Find Route and Restaurants
        </button>
      </div>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          center={{ lat: 40.7128, lng: -74.006 }}
          zoom={10}
          mapContainerStyle={{ height: "400px", width: "100%" }}
        >
          {directionsResponse && (
            <DirectionsRenderer options={{ directions: directionsResponse }} />
          )}

          {restaurants.map((restaurant, index) => (
            <Marker
              key={index}
              position={{
                lat: restaurant.geometry.location.lat,
                lng: restaurant.geometry.location.lng,
              }}
              title={restaurant.name}
              onClick={() => setSelectedRestaurant(restaurant)}
            />
          ))}

          {selectedRestaurant && (
            <InfoWindow
              position={{
                lat: selectedRestaurant.geometry.location.lat,
                lng: selectedRestaurant.geometry.location.lng,
              }}
              onCloseClick={() => setSelectedRestaurant(null)}
            >
              <div>
                <h3>{selectedRestaurant.name}</h3>
                <p>{selectedRestaurant.vicinity}</p>
                <p>Rating: {selectedRestaurant.rating}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default RouteAndRestaurantsMap;
