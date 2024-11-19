// ===============================
// src/components/ServiceFilterButton.jsx
// ===============================

import React, { useState } from 'react';
import {
    FaWifi,
    FaParking,
    FaDog,
    FaSnowflake,
    FaConciergeBell,
    FaMusic,
    FaTv
} from 'react-icons/fa'; // Importar íconos
import { IoMdClose } from "react-icons/io"; // Ícono de cierre
import './ServiceFilterButton.css'; // Importar estilos

/**
 * Componente ServiceFilterButton
 * ----------------------------------
 * Permite a los usuarios filtrar servicios disponibles.
 * Incluye funcionalidades para seleccionar, deseleccionar y limpiar filtros.
 *
 * @param {Array} services - Lista de servicios disponibles.
 * @param {Function} onSelectServices - Callback para manejar la selección de servicios.
 */
const ServiceFilterButton = ({ services, onSelectServices }) => {
    // Estado para controlar el estado del dropdown
    const [isExpanded, setIsExpanded] = useState(false);

    // Estado para almacenar los servicios seleccionados
    const [selectedServices, setSelectedServices] = useState([]);

    /**
     * Alterna la visibilidad del menú desplegable.
     */
    const handleToggle = () => {
        setIsExpanded((prev) => !prev);
    };

    /**
     * Maneja la selección o deselección de un servicio.
     *
     * @param {string} service - El servicio seleccionado/deseleccionado.
     */
    const handleServiceClick = (service) => {
        setSelectedServices((prevSelected) => {
            const isSelected = prevSelected.includes(service);
            const newSelected = isSelected
                ? prevSelected.filter((s) => s !== service) // Deselecciona
                : [...prevSelected, service]; // Selecciona
            onSelectServices(newSelected); // Notifica al padre
            return newSelected;
        });
    };

    /**
     * Limpia todos los filtros seleccionados.
     */
    const handleClear = () => {
        setSelectedServices([]);
        onSelectServices([]); // Notifica al padre que se limpió todo
    };

    /**
     * Mapeo de servicios con sus íconos correspondientes.
     */
    const serviceIcons = {
        "Order Online": <FaConciergeBell />,
        Delivery: <FaConciergeBell />,
        "Pick up": <FaConciergeBell />,
        Parking: <FaParking />,
        "A/C": <FaSnowflake />,
        WIFI: <FaWifi />,
        "Live Music": <FaMusic />,
        "Pet Friendly": <FaDog />,
        Catering: <FaConciergeBell />,
        "WC Access": <FaConciergeBell />,
        TV: <FaTv />,
        Bar: <FaConciergeBell />
    };

    /**
     * Filtra los servicios excluyendo métodos de pago.
     */
    const nonPaymentServices = services.filter(
        (service) =>
            ![
                "Acepta tarjeta",
                "Acepta BTC",
                "Acepta Efectivo",
                "Acepta Pago Móvil"
            ].includes(service)
    );

    return (
        <div className="service-filter-button-container">
            {/* Dropdown de servicios */}
            {isExpanded && (
                <div className="service-filter-dropdown">
                    {/* Botón para limpiar filtros */}
                    <button className="service-clear-filter-button" onClick={handleClear}>
                        Limpiar filtro
                    </button>

                    {/* Opciones de servicios */}
                    {nonPaymentServices.map((service) => (
                        <button
                            key={service}
                            onClick={() => handleServiceClick(service)}
                            className={`service-filter-option ${selectedServices.includes(service) ? 'selected' : ''}`}
                        >
                            {serviceIcons[service]} {service}
                        </button>
                    ))}
                </div>
            )}

            {/* Botón para alternar el dropdown */}
            <button className="service-icon-button" onClick={handleToggle}>
                {isExpanded ? <IoMdClose /> : <FaConciergeBell />}
            </button>
        </div>
    );
};

export default ServiceFilterButton;
