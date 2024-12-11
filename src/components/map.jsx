import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import SearchButton from './SearchButton';
import CategoryFilterButton from './CategoryFilterButton';
import ServiceFilterButton from './ServiceFilterButton';
import PaymentMethodFilterButton from './PaymentMethodFilterButton';
// import { object } from 'framer-motion/client';

/* ===============================
   Configuración de íconos
=============================== */
const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [41, 41],
    iconAnchor: [12, 41],
});

const singularIcon = new L.Icon({
    iconUrl: '/logomap.png',
    iconSize: [100, 100],
    iconAnchor: [50, 50],
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
    }, []);

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

                {filteredSitios.map((sitio) => (
                    <Marker key={sitio.id} position={[sitio.latitude, sitio.longitude]} icon={singularIcon}>
                        <Popup>
                            <strong>{sitio.name}</strong>
                            <br />
                            {sitio.location}
                            <br />
                            {sitio.opening_hours}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapaSitios;
