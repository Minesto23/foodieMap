// ===============================
// src/components/SearchButton.jsx
// ===============================

import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './SearchButton.css'; // Importar estilos

/**
 * Componente SearchButton
 * ----------------------------------
 * Proporciona un campo de búsqueda interactivo con sugerencias de autocompletado.
 *
 * @param {Function} onSearch - Callback que se ejecuta al realizar una búsqueda.
 * @param {Array} suggestions - Lista de sugerencias para el autocompletado.
 */
const SearchButton = ({ onSearch, suggestions }) => {
    const [isExpanded, setIsExpanded] = useState(false); // Controla si el campo está abierto
    const [searchQuery, setSearchQuery] = useState(''); // Almacena el texto de búsqueda
    const [filteredSuggestions, setFilteredSuggestions] = useState([]); // Lista de sugerencias filtradas

    /**
     * Actualiza las sugerencias filtradas en función de la consulta de búsqueda.
     */
    useEffect(() => {
        if (searchQuery) {
            const filtered = suggestions.filter((suggestion) =>
                suggestion.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions([]);
        }
    }, [searchQuery, suggestions]);

    /**
     * Alterna la visibilidad del campo de búsqueda.
     */
    const handleToggle = () => {
        setIsExpanded((prev) => !prev);
        if (isExpanded) {
            setSearchQuery(''); // Limpia el campo al cerrar
            setFilteredSuggestions([]);
        }
    };

    /**
     * Maneja la búsqueda al presionar Enter o al hacer clic en el botón.
     */
    const handleSearch = () => {
        if (searchQuery.trim()) {
            onSearch(searchQuery); // Execute the search callback
            setSearchQuery(''); // Clear the query
            setFilteredSuggestions([]); // Clear suggestions
            setIsExpanded(false); // Close the search field immediately
        }
    };

    /**
     * Ejecuta una búsqueda con la sugerencia seleccionada.
     *
     * @param {string} suggestion - Sugerencia seleccionada.
     */
    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        setFilteredSuggestions([]);
        onSearch(suggestion); // Ejecuta la búsqueda con la sugerencia
        setIsExpanded(false);
    };

    /**
     * Maneja la búsqueda al presionar Enter.
     *
     * @param {KeyboardEvent} e - Evento del teclado.
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="search-button-container">
            {/* Botón para alternar el campo de búsqueda */}
            <button
                className="icon-button"
                onClick={handleToggle}
                aria-label={isExpanded ? 'Cerrar búsqueda' : 'Abrir búsqueda'}
            >
                {isExpanded ? <FaTimes /> : <FaSearch />}
            </button>

            {/* Campo de búsqueda y sugerencias */}
            {isExpanded && (
                <div className="autocomplete-container">
                    {/* Campo de entrada de búsqueda */}
                    <input
                        type="text"
                        placeholder="Buscar restaurante"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        autoFocus
                        className="search-input"
                    />

                    {/* Lista de sugerencias */}
                    {filteredSuggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {filteredSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchButton;
