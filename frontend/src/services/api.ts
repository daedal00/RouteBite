import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

export interface RouteRequest {
  start: string;
  destination: string;
}

export interface RouteResponse {
  route: Route;
  restaurants: Restaurant[];
}

export interface Route {
  geocoded_waypoints: GeocodedWaypoint[];
  routes: RouteDetails[];
  distance: number;
  duration: number;
  polyline: string;
}

export interface RouteDetails {
  bounds: {
    northeast: LatLng;
    southwest: LatLng;
  };
  copyrights: string;
  legs: Leg[];
  overview_polyline: {
    points: string;
  };
  summary: string;
  warnings: string[];
  waypoint_order: number[];
}

export interface GeocodedWaypoint {
  geocoder_status: string;
  place_id: string;
  types: string[];
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Leg {
  distance: TextValue;
  duration: TextValue;
  end_address: string;
  end_location: LatLng;
  start_address: string;
  start_location: LatLng;
  steps: Step[];
  traffic_speed_entry: Array<{
    speed_in_meters_per_second: number;
    offset_meters: number;
  }>;
  via_waypoint: Array<{
    location: LatLng;
    step_index: number;
    step_interpolation: number;
  }>;
}

export interface TextValue {
  text: string;
  value: number;
}

export interface Step {
  distance: TextValue;
  duration: TextValue;
  end_location: LatLng;
  html_instructions: string;
  polyline: {
    points: string;
  };
  start_location: LatLng;
  travel_mode: string;
  maneuver?: string;
}

export interface Restaurant {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  detourTime: number;
  business_status?: string;
  icon?: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: Photo[];
  price_level?: number;
  types?: string[];
}

export interface Photo {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

export const fetchRouteAndRestaurants = async (
  routeRequest: RouteRequest
): Promise<RouteResponse> => {
  const response = await axios.get(`${API_BASE_URL}/route-and-restaurants`, {
    params: routeRequest,
  });
  return response.data;
};
