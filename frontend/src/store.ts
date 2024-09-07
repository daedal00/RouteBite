import { configureStore } from "@reduxjs/toolkit";
import routeReducer from "./features/route/routeSlice";
import restaurantsReducer from "./features/restaurants/restaurantsSlice";

export const store = configureStore({
  reducer: {
    route: routeReducer,
    restaurants: restaurantsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
