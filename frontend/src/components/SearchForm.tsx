import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { fetchRoute } from "../features/route/routeSlice";
import { fetchRestaurants } from "../features/restaurants/restaurantsSlice";

function SearchForm() {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(fetchRoute({ start, destination })).unwrap();
      await dispatch(fetchRestaurants({ start, destination })).unwrap();
    } catch (error) {
      console.error("Error fetching route and restaurants:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        placeholder="Start location"
        required
      />
      <input
        type="text"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        placeholder="Destination"
        required
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchForm;
