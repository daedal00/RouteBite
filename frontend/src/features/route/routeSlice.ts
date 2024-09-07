import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import {
  fetchRouteAndRestaurants,
  RouteRequest,
  RouteResponse,
} from "../../services/api";

export interface Route {
  distance: number;
  duration: number;
  polyline: string;
  // Add other relevant route properties
}

interface RouteState {
  data: Route | null;
  loading: boolean;
  error: string | null;
}

const initialState: RouteState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchRoute = createAsyncThunk(
  "route/fetchRoute",
  async (request: RouteRequest) => {
    const response = await fetchRouteAndRestaurants(request);
    return response.route;
  }
);

const routeSlice = createSlice({
  name: "route",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRoute.fulfilled,
        (state, action: PayloadAction<RouteResponse["route"]>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const selectRoute = (state: RootState) => state.route.data;

export default routeSlice.reducer;
