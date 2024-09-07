import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { selectRestaurant } from "../features/restaurants/restaurantsSlice";
import { Restaurant } from "../services/api";

function RestaurantList() {
  const restaurants = useSelector((state: RootState) => state.restaurants.data);
  const route = useSelector((state: RootState) => state.route.data);
  const dispatch = useDispatch();

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    if (route) {
      dispatch(selectRestaurant(restaurant));
    } else {
      console.error("No route available");
    }
  };

  if (!route) {
    return <p>Please search for a route first.</p>;
  }

  return (
    <div className="restaurant-list">
      <h2>Nearby Restaurants</h2>
      {restaurants.length === 0 ? (
        <p>No restaurants found.</p>
      ) : (
        <ul>
          {restaurants.map((restaurant, index) => (
            <li
              key={`${restaurant.place_id}-${index}`}
              className="restaurant-item"
            >
              <h3>{restaurant.name}</h3>
              <p>Rating: {restaurant.rating} / 5</p>
              <p>
                Detour Time: {Math.round(restaurant.detourTime / 60)} minutes
              </p>
              <button onClick={() => handleSelectRestaurant(restaurant)}>
                Select
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RestaurantList;
