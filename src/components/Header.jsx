import React from "react";
import "./Header.css"; // Archivo CSS para estilos

/**
 * Componente Header
 * ----------------------------------
 * Muestra un header transparente con contenido flotante en esquinas opuestas.
 */
const Header = () => {
  const foodieLink = "https://admin.tufoodie.com/"; // Enlace reutilizable

  return (
    <header className="header-container">
      {/* Logo en la esquina izquierda */}
      <a href={foodieLink} target="_blank" rel="noopener noreferrer">
        <div className="header-logo">
          <img src="/logo192.png" alt="Logo" className="header-logo-img" />
          <span className="header-title">Foodie</span>
        </div>
      </a>

      {/* Mensaje en el centro */}
      <div className="header-beta">
        <span className="header-beta-text">
          Estamos en fase de pruebas, si encuentras algún error por favor{" "}
          <a
            href="https://admin.tufoodie.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="header-contact-link"
          >
            contáctanos
          </a>.
        </span>
      </div>

      {/* Texto y botón en la esquina derecha */}
      <div className="header-contact">
        <span className="header-text">¿Quieres ser parte de nuestra familia?</span>
        <a href="https://admin.tufoodie.com/" target="_blank" rel="noopener noreferrer" className="header-button">
          Sumate
        </a>
      </div>
    </header>

  );
};

export default Header;
