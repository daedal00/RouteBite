import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
  Libraries,
} from "@react-google-maps/api";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const libraries: Libraries = ["marker"];

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 40.7128,
  lng: -74.006,
};

function Map() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const route = useSelector((state: RootState) => state.route.data);
  const restaurants = useSelector((state: RootState) => state.restaurants.data);

  const fitBounds = useCallback(() => {
    if (map && route && restaurants.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      if (route.polyline) {
        const path = google.maps.geometry.encoding.decodePath(route.polyline);
        path.forEach((point) => bounds.extend(point));
      }
      restaurants.forEach((restaurant) =>
        bounds.extend(new google.maps.LatLng(restaurant.geometry.location))
      );
      map.fitBounds(bounds);
    }
  }, [map, route, restaurants]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    fitBounds();
  }, [fitBounds]);

  useEffect(() => {
    if (isLoaded && map) {
      // Clear existing markers
      markersRef.current.forEach((marker) => (marker.map = null));

      // Create new markers
      markersRef.current = restaurants.map((restaurant) => {
        return new google.maps.marker.AdvancedMarkerElement({
          map,
          position: restaurant.geometry.location,
          title: restaurant.name,
        });
      });
    }
  }, [isLoaded, map, restaurants]);

  if (!isLoaded) return null;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{ mapId: "DEMO_MAP_ID" }}
    >
      {route && route.polyline && (
        <Polyline
          path={google.maps.geometry.encoding.decodePath(route.polyline)}
          options={{ strokeColor: "#FF0000" }}
        />
      )}
    </GoogleMap>
  );
}

export default React.memo(Map);
