import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { fetchRouteAndRestaurants, RouteRequest } from "../../services/api";
import { Restaurant as ApiRestaurant } from "../../services/api";

export type Restaurant = ApiRestaurant;

export interface RestaurantsState {
  data: Restaurant[];
  loading: boolean;
  error: string | null;
  selectedRestaurant: Restaurant | null;
}

const initialState: RestaurantsState = {
  data: [],
  loading: false,
  error: null,
  selectedRestaurant: null,
};

export const fetchRestaurants = createAsyncThunk(
  "restaurants/fetchRestaurants",
  async (request: RouteRequest) => {
    const response = await fetchRouteAndRestaurants(request);
    return response.restaurants;
  }
);

const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    selectRestaurant: (state, action: PayloadAction<Restaurant>) => {
      state.selectedRestaurant = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRestaurants.fulfilled,
        (state, action: PayloadAction<Restaurant[]>) => {
          state.data = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const { selectRestaurant } = restaurantsSlice.actions;

export const selectRestaurants = (state: RootState) => state.restaurants.data;
export const selectSelectedRestaurant = (state: RootState) =>
  state.restaurants.selectedRestaurant;

export default restaurantsSlice.reducer;
