// src/App.js
import React from "react";
import Header from "./components/Header"; // Importa el Header
import MapaSitios from "./components/map";

function App() {
  return (
    <div
      className="App"
      style={{
        height: "100vh", // Ocupar toda la ventana
        overflow: "hidden", // Desactivar el scroll
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <MapaSitios />
    </div>
  );
}

export default App;
