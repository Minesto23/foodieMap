// src/App.js
import React from "react";
import Header from "./components/Header"; // Importa el Header
import MapaSitios from "./components/map";

function App() {
  return (
    <div className="App">
      <Header />
      <MapaSitios />
    </div>
  );
}

export default App;
