import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import Map from "./components/Map";
import RestaurantList from "./components/RestaurantList";
import SearchForm from "./components/SearchForm";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <h1>RouteBite</h1>
        </header>
        <main>
          <p>Test message - If you can see this, the app is rendering.</p>
          <SearchForm />
          <Map />
          <RestaurantList />
        </main>
      </div>
    </Provider>
  );
}

export default App;
