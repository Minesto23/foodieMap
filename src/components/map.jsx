// ===============================
// src/components/MapaSitios.jsx
// ===============================

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import SearchButton from './SearchButton';
import CategoryFilterButton from './CategoryFilterButton';
import ServiceFilterButton from './ServiceFilterButton';
import PaymentMethodFilterButton from './PaymentMethodFilterButton';

/* ===============================
   Configuración de íconos
=============================== */
const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [41, 41],
    iconAnchor: [12, 41]
});

const singularIcon = new L.Icon({
    iconUrl: '/logomap.png',
    iconSize: [100, 100],
    iconAnchor: [50, 50]
});

/* ===============================
   Componente para centrar el mapa
=============================== */
const SetViewOnLocation = ({ coords }) => {
    const map = useMap();

    useEffect(() => {
        if (coords) {
            map.setView(coords, 15); // Nivel de zoom
        }
    }, [coords, map]);

    return null;
};

/* ===============================
   Función auxiliar para geocodificar direcciones
=============================== */
const fetchCoordinates = async (address) => {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return { lat: parseFloat(lat), lng: parseFloat(lon) };
        }
    } catch (error) {
        console.error(`Error fetching coordinates for ${address}:`, error);
    }
    return null;
};

/* ===============================
   Componente principal: MapaSitios
=============================== */
const MapaSitios = () => {
    // Estados
    const [sitios, setSitios] = useState([]);
    const [ubicacion, setUbicacion] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);
    const [geocodedLocations, setGeocodedLocations] = useState({});
    const [searchLocation, setSearchLocation] = useState(null);

    const restaurantNames = sitios.map((sitio) => sitio.name).filter(Boolean);

    /* ===============================
       Datos estáticos: categorías, servicios, métodos de pago
    =============================== */
    const categories = [
        'Panaderia', 'Carne y Pescado', 'Cafetería', 'Bar', 'Americana', 'Barbacoa',
        'Hamburguesas', 'Asiática', 'China', 'Japonesa', 'Italiana', 'Francesa',
        'Fusión', 'Saludable', 'Parrilla', 'Casera', 'Helados', 'India',
        'Internacional', 'Latina', 'Mexicana', 'Pizza', 'Peruana', 'Comida Marina',
        'Española', 'Comida Callejera', 'Sushi', 'Tacos', 'Vegan', 'Vegetariana'
    ];

    const services = [
        'Order Online', 'Delivery', 'Pick up', 'Acepta tarjeta', 'Acepta BTC',
        'Acepta Efectivo', 'Acepta Pago Móvil', 'Parking', 'A/C', 'WIFI',
        'Live Music', 'Pet Friendly', 'Catering', 'WC Access', 'TV', 'Bar'
    ];

    const paymentMethods = ['Acepta tarjeta', 'Acepta BTC', 'Acepta Efectivo', 'Acepta Pago Móvil'];

    /* ===============================
       Efectos para API y geolocalización
    =============================== */
    useEffect(() => {
        const fetchSitios = async () => {
            try {
                const response = await axios.get('https://detip.pythonanywhere.com/api/restaurant/');
                setSitios(response.data);
            } catch (error) {
                console.error('Error fetching API data:', error);
            }
        };
        fetchSitios();
    }, []);

    useEffect(() => {
        const geocodeMissingLocations = async () => {
            const updatedGeocodedLocations = { ...geocodedLocations };
            const fetchPromises = sitios.map(async (sitio) => {
                if (!sitio.latitude || !sitio.longitude) {
                    const address = sitio.location;
                    if (!updatedGeocodedLocations[address]) {
                        const coords = await fetchCoordinates(address);
                        if (coords) {
                            updatedGeocodedLocations[address] = coords;
                        }
                    }
                }
            });
            await Promise.all(fetchPromises);
            setGeocodedLocations(updatedGeocodedLocations);
        };

        if (sitios.length > 0) {
            geocodeMissingLocations();
        }
    }, [sitios, geocodedLocations]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUbicacion({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => console.error("Error getting location:", error)
            );
        }
    }, []);

    /* ===============================
       Manejadores de eventos
    =============================== */
    const handleSearch = (query) => {
        const sitio = sitios.find((s) => s.name && s.name.toLowerCase() === query.toLowerCase());
        if (sitio) {
            setSearchLocation({ lat: sitio.latitude, lng: sitio.longitude });
        } else {
            alert('Restaurante no encontrado');
        }
    };

    const handleCategorySelect = (category) => setSelectedCategory(category);
    const handleServiceSelect = (services) => setSelectedServices(services);
    const handlePaymentMethodSelect = (methods) => setSelectedPaymentMethods(methods);

    /* ===============================
       Filtro de sitios
    =============================== */
    const filteredSitios = sitios.filter((sitio) => {
        const matchesCategory = selectedCategory ? sitio.restaurant_type?.includes(selectedCategory) : true;
        const matchesServices = selectedServices.length
            ? selectedServices.some((service) => sitio.services?.includes(service))
            : true;
        const matchesPaymentMethods = selectedPaymentMethods.length
            ? selectedPaymentMethods.some((method) => sitio.payment_methods?.includes(method))
            : true;

        const coords = sitio.latitude && sitio.longitude
            ? { lat: sitio.latitude, lng: sitio.longitude }
            : geocodedLocations[sitio.location];

        return coords && matchesCategory && matchesServices && matchesPaymentMethods;
    });

    /* ===============================
       Renderización
    =============================== */
    return (
        <div style={{ position: "relative" }}>
            {/* Panel de controles */}
            <div style={{
                position: "absolute",
                top: "100px",
                left: "16px",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                gap: "8px"
            }}>
                <SearchButton onSearch={handleSearch} suggestions={restaurantNames} />
                <CategoryFilterButton categories={categories} onSelectCategory={handleCategorySelect} />
                <ServiceFilterButton services={services} onSelectServices={handleServiceSelect} />
                <PaymentMethodFilterButton paymentMethods={paymentMethods} onSelectPaymentMethods={handlePaymentMethodSelect} />
            </div>

            {/* Mapa principal */}
            <MapContainer
                center={ubicacion || [40.7128, -74.006]}
                zoom={ubicacion ? 15 : 12}
                style={{ height: '100vh', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />

                {searchLocation && <SetViewOnLocation coords={searchLocation} />}
                {ubicacion && <Marker position={ubicacion} icon={customIcon}><Popup>Tu ubicación actual</Popup></Marker>}
                {ubicacion && <SetViewOnLocation coords={ubicacion} />}

                {filteredSitios.map((sitio) => {
                    const coords = sitio.latitude && sitio.longitude
                        ? { lat: sitio.latitude, lng: sitio.longitude }
                        : geocodedLocations[sitio.location];
                    return coords ? (
                        <Marker key={sitio.id} position={[coords.lat, coords.lng]} icon={singularIcon}>
                            <Popup>
                                <strong>{sitio.name}</strong>
                                <br />
                                {sitio.location}
                                <br />
                                {sitio.opening_hours}
                            </Popup>
                        </Marker>
                    ) : null;
                })}
            </MapContainer>
        </div>
    );
};

export default MapaSitios;
