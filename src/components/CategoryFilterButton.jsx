// ===============================
// src/components/CategoryFilterButton.jsx
// ===============================

import React, { useState } from 'react';
import {
    FaPizzaSlice,
    FaFish,
    FaCoffee,
    FaBeer,
    FaLeaf,
    FaIceCream,
    FaHamburger,
    FaAppleAlt
} from 'react-icons/fa'; // Importar íconos
import { PiBookOpenTextBold } from "react-icons/pi"; // Ícono para categoría
import { IoMdClose } from "react-icons/io"; // Ícono de cerrar
import './CategoryFilterButton.css'; // Importar estilos

/**
 * Componente CategoryFilterButton
 * ----------------------------------
 * Permite a los usuarios seleccionar una categoría de filtro.
 * Incluye opciones de selección y un botón para limpiar la categoría seleccionada.
 *
 * @param {Array} categories - Lista de categorías disponibles.
 * @param {Function} onSelectCategory - Callback para manejar la categoría seleccionada.
 */
const CategoryFilterButton = ({ categories, onSelectCategory }) => {
    // Estado para controlar la visibilidad del dropdown
    const [isExpanded, setIsExpanded] = useState(false);

    // Estado para almacenar la categoría seleccionada
    const [selectedCategories, setSelectedCategories] = useState([]);

    /**
     * Alterna la visibilidad del menú desplegable.
     */
    const handleToggle = () => {
        setIsExpanded((prev) => !prev);
    };

    /**
     * Maneja la selección de una categoría.
     *
     * @param {string} category - La categoría seleccionada.
     */
    const handleCategoryClick = (category) => {
        setSelectedCategories((prevSelected) => {
            const isSelected = prevSelected.includes(category);
            const newSelected = isSelected
                ? prevSelected.filter((cat) => cat !== category) // Deselecciona
                : [...prevSelected, category]; // Selecciona
            onSelectCategory(newSelected); // Notifica al padre
            return newSelected;
        });
    };



    /**
     * Limpia la categoría seleccionada.
     */
    /**
 * Limpia las categorías seleccionadas.
 */
    const handleClear = () => {
        setSelectedCategories([]); // Clear all selections
        onSelectCategory([]); // Notify parent that no filter is active
    };


    /**
     * Mapeo de categorías con sus íconos correspondientes.
     */
    const categoryIcons = {
        Panaderia: <FaAppleAlt />,
        "Carne y Pescado": <FaFish />,
        Cafetería: <FaCoffee />,
        Bar: <FaBeer />,
        Americana: <FaHamburger />,
        Barbacoa: <FaPizzaSlice />,
        Hamburguesas: <FaHamburger />,
        Asiática: <FaLeaf />,
        China: <FaFish />,
        Japonesa: <FaFish />,
        Italiana: <FaPizzaSlice />,
        Francesa: <FaAppleAlt />,
        Fusión: <FaLeaf />,
        Saludable: <FaAppleAlt />,
        Parrilla: <FaPizzaSlice />,
        Casera: <FaAppleAlt />,
        Helados: <FaIceCream />,
        India: <FaAppleAlt />,
        Internacional: <FaLeaf />,
        Latina: <FaLeaf />,
        Mexicana: <FaPizzaSlice />,
        Pizza: <FaPizzaSlice />,
        Peruana: <FaFish />,
        "Comida Marina": <FaFish />,
        Española: <FaFish />,
        "Comida Callejera": <FaHamburger />,
        Sushi: <FaFish />,
        Tacos: <FaHamburger />,
        Vegan: <FaLeaf />,
        Vegetariana: <FaLeaf />
    };

    return (
        <div className="category-filter-button-container">
            {/* Dropdown de categorías */}
            {isExpanded && (
                <div className="category-filter-dropdown">
                    {/* Botón para limpiar la categoría */}
                    <button
                        className="category-clear-filter-button"
                        onClick={handleClear}
                    >
                        Limpiar filtro
                    </button>

                    {/* Opciones de categorías */}
                    {categories.map((category) => (
                        <div
                            key={category}
                            className={`category-filter-option ${selectedCategories.includes(category) ? 'selected' : ''}`}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {categoryIcons[category]} {category} {/* Icon + Name */}
                        </div>
                    ))}
                </div>
            )}

            {/* Botón para alternar el dropdown */}
            <button className="category-icon-button" onClick={handleToggle}>
                {isExpanded ? <IoMdClose /> : <PiBookOpenTextBold />}
            </button>
        </div>
    );
};

export default CategoryFilterButton;
