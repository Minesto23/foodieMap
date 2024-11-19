// ===============================
// src/components/PaymentMethodFilterButton.jsx
// ===============================

import React, { useState } from 'react';
import {
    FaCreditCard,
    FaBitcoin,
    FaMoneyBill,
    FaMobileAlt
} from 'react-icons/fa'; // Importar íconos principales
import { BsCash } from "react-icons/bs"; // Ícono para el botón
import { IoMdClose } from "react-icons/io"; // Ícono de cerrar
import './PaymentMethodFilterButton.css'; // Importar estilos

/**
 * Componente PaymentMethodFilterButton
 * ------------------------------------
 * Un botón con funcionalidad de filtro de métodos de pago.
 * Permite seleccionar múltiples métodos de pago y filtrar la lista según las selecciones.
 * 
 * @param {Array} paymentMethods - Lista de métodos de pago disponibles.
 * @param {Function} onSelectPaymentMethods - Callback para manejar las selecciones.
 */
const PaymentMethodFilterButton = ({ paymentMethods, onSelectPaymentMethods }) => {
    // Estado para manejar la visibilidad del dropdown
    const [isExpanded, setIsExpanded] = useState(false);

    // Estado para almacenar métodos seleccionados
    const [selectedMethods, setSelectedMethods] = useState([]);

    /**
     * Alterna la visibilidad del dropdown.
     */
    const handleToggle = () => {
        setIsExpanded((prev) => !prev);
    };

    /**
     * Maneja la selección o deselección de un método de pago.
     * 
     * @param {string} method - Método de pago seleccionado.
     */
    const handleMethodClick = (method) => {
        setSelectedMethods((prevSelected) => {
            const isSelected = prevSelected.includes(method);
            const newSelected = isSelected
                ? prevSelected.filter((m) => m !== method) // Elimina si ya está seleccionado
                : [...prevSelected, method]; // Agrega si no está seleccionado
            onSelectPaymentMethods(newSelected); // Actualiza en el callback
            return newSelected;
        });
    };

    /**
     * Mapeo de métodos de pago con sus íconos correspondientes.
     */
    const methodIcons = {
        "Acepta tarjeta": <FaCreditCard />,
        "Acepta BTC": <FaBitcoin />,
        "Acepta Efectivo": <FaMoneyBill />,
        "Acepta Pago Móvil": <FaMobileAlt />,
    };

    return (
        <div className="payment-method-container">
            {/* Dropdown de métodos de pago */}
            {isExpanded && (
                <div className="payment-method-dropdown">
                    {/* Botón para limpiar los filtros */}
                    <button
                        className="clear-filter-button"
                        onClick={() => {
                            setSelectedMethods([]); // Limpia selecciones
                            onSelectPaymentMethods([]); // Notifica al padre
                        }}
                    >
                        Limpiar filtro
                    </button>

                    {/* Opciones de métodos de pago */}
                    {paymentMethods.map((method) => (
                        <div
                            key={method}
                            className={`payment-method-option ${selectedMethods.includes(method) ? 'selected' : ''}`}
                            onClick={() => handleMethodClick(method)}
                        >
                            {methodIcons[method]} {method}
                        </div>
                    ))}
                </div>
            )}

            {/* Botón para alternar el dropdown */}
            <button className="payment-method-toggle-button" onClick={handleToggle}>
                {isExpanded ? <IoMdClose /> : <BsCash />}
            </button>
        </div>
    );
};

export default PaymentMethodFilterButton;
