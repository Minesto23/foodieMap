import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import SearchButton from './SearchButton';
import CategoryFilterButton from './CategoryFilterButton';
import ServiceFilterButton from './ServiceFilterButton';
import PaymentMethodFilterButton from './PaymentMethodFilterButton';
// import { object } from 'framer-motion/client';
// import { Box, Text, Link, Image } from "@chakra-ui/react";
// import { FaMapMarkerAlt, FaClock, FaConciergeBell, FaInstagram } from "react-icons/fa";


/* ===============================
   Configuración de íconos
=============================== */
const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [41, 41],
    iconAnchor: [20.5, 41], // Ajustado al centro inferior
});

const singularIcon = new L.Icon({
    iconUrl: '/logomap.png',
    iconSize: [100, 100],
    iconAnchor: [52, 75],
});

/* ===============================
   Helper Component: Dynamic Map Centering
=============================== */
const SetViewOnLocation = ({ center }) => {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);

    return null;
};

/* ===============================
   Static Data: Categories & Services
=============================== */
const categories = {
    panaderia: 'Panaderia',
    carne_pescado: 'Carne y Pescado',
    cafeteria: 'Cafetería',
    bar: 'Bar',
    americana: 'Americana',
    barbacoa: 'Barbacoa',
    hamburguesas: 'Hamburguesas',
    asiatica: 'Asiática',
    china: 'China',
    japonesa: 'Japonesa',
    italiana: 'Italiana',
    francesa: 'Francesa',
    fusion: 'Fusión',
    saludable: 'Saludable',
    parrilla: 'Parrilla',
    casera: 'Casera',
    helados: 'Helados',
    india: 'India',
    internacional: 'Internacional',
    latina: 'Latina',
    mexicana: 'Mexicana',
    pizza: 'Pizza',
    peruana: 'Peruana',
    comida_marina: 'Comida Marina',
    espanola: 'Española',
    comida_callejera: 'Comida Callejera',
    sushi: 'Sushi',
    tacos: 'Tacos',
    vegan: 'Vegan',
    vegetariana: 'Vegetariana'
};


const services = {
    order_online: 'Order Online',
    delivery: 'Delivery',
    pick_up: 'Pick up',
    parking: 'Parking',
    ac: 'A/C',
    wifi: 'WIFI',
    live_music: 'Live Music',
    pet_friendly: 'Pet Friendly',
    catering: 'Catering',
    wc_access: 'WC Access',
    tv: 'TV',
    bar: 'Bar'
};

const paymentMethods = {
    acepta_tarjeta: 'Acepta tarjeta',
    acepta_btc: 'Acepta Binance',
    acepta_efectivo: 'Acepta Efectivo',
    acepta_pago_movil: 'Acepta Pago Móvil',
    acepta_paypal: 'Acepta Paypal'
};

const MapaSitios = () => {
    const [sitios, setSitios] = useState([]);
    const [subscribedUsers, setSubscribedUsers] = useState({}); // Guarda el estado de suscripción de cada usuario
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);
    const [searchLocation, setSearchLocation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState([7.7756663, -72.2214154]);

    const restaurantNames = sitios.map((sitio) => sitio.name).filter(Boolean);

    useEffect(() => {
        const fetchSitios = async () => {
            try {
                const response = await axios.get('https://detip.pythonanywhere.com/api/restaurant/');
                setSitios(response.data);
                // Llamar a la API para obtener `is_subscribed` de cada usuario dueño del restaurante
                response.data.forEach((sitio) => {
                    if (!subscribedUsers[sitio.user]) {  // Si no ha sido consultado antes
                        fetchUserSubscription(sitio.user);
                    }
                });
            } catch (error) {
                console.error('Error fetching API data:', error);
            }
        };
        fetchSitios();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation([position.coords.latitude, position.coords.longitude]);
                },
                () => {
                    console.warn('Geolocation unavailable, using default location.');
                }
            );
        }
        // eslint-disable-next-line
    }, []);

    // Función para obtener `is_subscribed` de cada usuario (dueño del restaurante)
    const fetchUserSubscription = async (userId) => {
        try {
            const response = await axios.get(`https://detip.pythonanywhere.com/api/user-subscription/${userId}`);
            setSubscribedUsers((prev) => ({ ...prev, [userId]: response.data.is_subscribed }));
        } catch (error) {
            console.error(`Error fetching subscription status for user ${userId}:`, error);
            setSubscribedUsers((prev) => ({ ...prev, [userId]: false })); // Asumimos que no está suscrito si hay error
        }
    };

    const handleSearch = (query) => {
        const sitio = sitios.find((s) => s.name && s.name.toLowerCase() === query.toLowerCase());
        if (sitio && typeof sitio.latitude === 'number' && typeof sitio.longitude === 'number') {
            setSearchLocation([sitio.latitude, sitio.longitude]);
        } else {
            alert('Restaurante no encontrado o no tiene coordenadas válidas.');
        }
    };

    const filteredSitios = sitios.filter((sitio) => {
        const typesArray = Array.isArray(sitio.restaurant_type) ? sitio.restaurant_type : [];
        const servicesArray = Array.isArray(sitio.services) ? sitio.services : [];
        const categoriesArray = Object.entries(categories)
            .filter(([key, value]) => selectedCategories.includes(value))
            .map(([key]) => key);

        const servicessArray = Object.entries(services)
            .filter(([key, value]) => selectedServices.includes(value))
            .map(([key]) => key);

        const paymentArray = Object.entries(paymentMethods)
            .filter(([key, value]) => selectedPaymentMethods.includes(value))
            .map(([key]) => key);




        const matchesCategories = categoriesArray.length
            ? categoriesArray.some((category) => typesArray.includes(category))
            : false;

        const matchesServices = servicessArray.length
            ? servicessArray.some((service) => servicesArray.includes(service))
            : false;

        const matchesPaymentMethods = paymentArray.length
            ? paymentArray.some((method) => servicesArray.includes(method))
            : false;

        const noFiltersApplied =
            selectedCategories.length === 0 &&
            selectedServices.length === 0 &&
            selectedPaymentMethods.length === 0;

        if (noFiltersApplied) {
            return sitio.latitude !== null && sitio.longitude !== null;
        }

        console.log(matchesCategories);


        return (
            sitio.latitude !== null &&
            sitio.longitude !== null &&
            (matchesCategories || matchesServices || matchesPaymentMethods)
        );
    });

    return (
        <div style={{ position: 'relative' }}>
            <div
                style={{
                    position: 'absolute',
                    top: '100px',
                    left: '16px',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                }}
            >
                <SearchButton onSearch={handleSearch} suggestions={restaurantNames} />
                <CategoryFilterButton
                    categories={Object.values(categories)}
                    onSelectCategory={(selected) => setSelectedCategories(selected)}
                />
                <ServiceFilterButton services={Object.values(services)} onSelectServices={setSelectedServices} />
                <PaymentMethodFilterButton paymentMethods={Object.values(paymentMethods)} onSelectPaymentMethods={setSelectedPaymentMethods} />
            </div>

            <MapContainer
                center={currentLocation}
                zoom={12}
                style={{ height: '100vh', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                <SetViewOnLocation center={searchLocation || currentLocation} />

                {searchLocation && (
                    <Marker position={searchLocation} icon={customIcon}>
                        <Popup>
                            <strong>Restaurante buscado</strong>
                        </Popup>
                    </Marker>
                )}

                {filteredSitios.map((sitio) => {
                    // 🔥 Verificar si el usuario está suscrito
                    const isSubscribed = subscribedUsers[sitio.user] ?? false;

                    return (
                        <Marker key={sitio.id} position={[sitio.latitude, sitio.longitude]} icon={singularIcon}>
                            <Popup>
                                <div style={{
                                    padding: "12px",
                                    maxWidth: "280px",
                                    fontFamily: "Arial, sans-serif",
                                    backgroundColor: "white",
                                    textAlign: "center",
                                    color: "black"
                                }}>
                                    {/* Imagen del restaurante */}
                                    <div style={{
                                        width: "100%",
                                        height: "130px",
                                        borderRadius: "10px",
                                        overflow: "hidden",
                                        marginBottom: "12px"
                                    }}>
                                        <img
                                            src={sitio.logo_url ? sitio.logo_url : "logo192.png"}
                                            alt={sitio.name}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    </div>

                                    {/* Nombre del Restaurante */}
                                    <h3 style={{
                                        margin: "8px 0",
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                        color: "black"
                                    }}>
                                        {sitio.name}
                                    </h3>

                                    {/* Horario */}
                                    <p style={{
                                        fontSize: "14px",
                                        margin: "6px 0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <i className="fa-solid fa-clock" style={{ marginRight: "8px", fontSize: "16px", color: "black" }}></i>
                                        {sitio.opening_hours || "Horario no disponible"}
                                    </p>

                                    {/* Dirección */}
                                    <p style={{
                                        fontSize: "14px",
                                        margin: "6px 0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexWrap: "wrap",

                                    }}>
                                        <i className="fa-solid fa-location-dot" style={{ marginRight: "8px", fontSize: "16px", color: "black" }}></i>
                                        {sitio.location || "Ubicación no disponible"}
                                    </p>

                                    {/* Opciones Premium: Instagram y Menú (Solo si el usuario está suscrito) */}
                                    {isSubscribed ? (
                                        <>
                                            {/* Servicios */}
                                            {sitio.services && sitio.services.length > 0 && (
                                                <p style={{
                                                    fontSize: "14px",
                                                    margin: "8px 0",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexWrap: "wrap",
                                                    color: "black"
                                                }}>
                                                    <i className="fa-solid fa-concierge-bell" style={{ marginRight: "8px", fontSize: "16px", color: "black" }}></i>
                                                    {sitio.services.map((service) => services[service] || service).join(", ")}
                                                </p>
                                            )}
                                            {sitio.instagram_url && (
                                                <a href={sitio.instagram_url} target="_blank" rel="noopener noreferrer"
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        color: "white",
                                                        textDecoration: "none",
                                                        marginTop: "10px",
                                                        fontSize: "14px",
                                                        fontWeight: "bold",
                                                        padding: "8px 14px",
                                                        borderRadius: "25px",
                                                        border: "1px solid #e53e3e",
                                                        backgroundColor: "#e53e3e",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    onMouseOver={(e) => e.target.style.backgroundColor = "#c53030"}
                                                    onMouseOut={(e) => e.target.style.backgroundColor = "#e53e3e"}
                                                >
                                                    <i className="fa-brands fa-instagram" style={{ marginRight: "6px", color: "white" }}></i>
                                                    Ver en Instagram
                                                </a>
                                            )}

                                            {/* Botón de acceso al menú */}
                                            <a href={`https://admin.tufoodie.com/restaurant/${sitio.id}`}
                                                target="_blank" rel="noopener noreferrer"
                                                style={{
                                                    display: "inline-block",
                                                    marginTop: "10px",
                                                    padding: "10px 16px",
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                    color: "white",
                                                    backgroundColor: "#e53e3e",
                                                    borderRadius: "25px",
                                                    textDecoration: "none",
                                                    transition: "all 0.3s ease",
                                                    border: "1px solid #e53e3e"
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = "#c53030"}
                                                onMouseOut={(e) => e.target.style.backgroundColor = "#e53e3e"}
                                            >
                                                <i className="fa-solid fa-utensils" style={{ marginRight: "10px", color: "white" }}></i>
                                                Ver Menú
                                            </a>
                                        </>
                                    ) : (
                                        <p style={{ marginTop: "10px", fontSize: "14px", color: "red", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {/* <i className="fa-solid fa-lock" style={{ marginRight: "6px", color: "black" }}></i> */}
                                        </p>

                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}







            </MapContainer>
        </div>
    );
};

export default MapaSitios;
