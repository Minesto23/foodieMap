// src/components/MapaSitios.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

// Icono personalizado para los marcadores estándar
const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [41, 41],
    iconAnchor: [12, 41]
});

// Icono personalizado para los puntos de Singular
const singularIcon = new L.Icon({
    iconUrl: '/logomap.png', // Reemplaza con la URL del logo de Singular
    iconSize: [100, 100],
    iconAnchor: [100, 100]
});

// Componente para centrar el mapa en la ubicación actual
const SetViewOnLocation = ({ coords }) => {
    const map = useMap();
    map.setView(coords, 12);
    return null;
};

// Función auxiliar para calcular una nueva posición a 10 metros de distancia
const calculateOffsetPosition = (lat, lng, distance = 10) => {
    const earthRadius = 6378137; // Radio de la Tierra en metros
    const dLat = distance / earthRadius;
    const newLat = lat + (dLat * (180 / Math.PI));
    return { lat: newLat, lng: lng };
};

const MapaSitios = () => {
    const [sitios, setSitios] = useState([]);
    const [ubicacion, setUbicacion] = useState(null);
    const [offsetUbicacion, setOffsetUbicacion] = useState(null);

    // Llamada a la API para obtener los datos de los sitios
    useEffect(() => {
        const fetchSitios = async () => {
            try {
                const response = await axios.get('URL_DE_LA_API');
                setSitios(response.data);
            } catch (error) {
                console.error('Error al obtener los datos de la API:', error);
            }
        };

        fetchSitios();
    }, []);

    // Obtener la ubicación actual del usuario
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUbicacion(currentLocation);

                    // Calcula una posición a 10 metros hacia el norte de la ubicación actual
                    const newPosition = calculateOffsetPosition(
                        position.coords.latitude,
                        position.coords.longitude,
                        10
                    );
                    setOffsetUbicacion(newPosition);
                },
                (error) => {
                    console.error("Error obteniendo la ubicación:", error);
                }
            );
        } else {
            console.error("Geolocalización no está soportada en este navegador.");
        }
    }, []);

    return (
        <MapContainer
            center={ubicacion || [40.7128, -74.006]} // Ubicación por defecto si no se obtiene la ubicación actual
            zoom={12}
            style={{ height: '100vh', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Agregar marcador en la ubicación actual */}
            {ubicacion && (
                <Marker position={ubicacion} icon={customIcon}>
                    <Popup>Tu ubicación actual</Popup>
                </Marker>
            )}

            {/* Agregar marcador a 10 metros de la ubicación actual */}
            {offsetUbicacion && (
                <Marker position={offsetUbicacion} icon={singularIcon}>
                    <Popup>Ubicación a 10 metros de ti</Popup>
                </Marker>
            )}

            {/* Centrar mapa en la ubicación actual */}
            {ubicacion && <SetViewOnLocation coords={ubicacion} />}

            {/* Agregar marcadores en función de los datos */}
            {sitios.map((sitio) => (
                <Marker
                    key={sitio.id}
                    position={[sitio.latitud, sitio.longitud]}
                    icon={sitio.tipo === 'singular' ? singularIcon : customIcon} // Condición para usar el icono de Singular
                >
                    <Popup>
                        <strong>{sitio.nombre}</strong>
                        <br />
                        {sitio.descripcion}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapaSitios;
