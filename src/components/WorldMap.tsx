'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import L from 'leaflet';

// Fix for default marker icons in Leaflet + Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapCity {
    city: string;
    country: string;
    lat: number;
    lng: number;
    slug: string;
    cost_index: number;
}

interface WorldMapProps {
    cities: MapCity[];
}

export default function WorldMap({ cities }: WorldMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div style={{ height: '500px', backgroundColor: 'var(--muted-light)', borderRadius: 'var(--radius-xl)' }} />;
    }

    return (
        <div className="card" style={{ padding: '0.5rem', overflow: 'hidden', height: '600px', border: 'none', boxShadow: 'var(--shadow-xl)' }}>
            <MapContainer
                center={[20, 0] as any}
                zoom={2}
                style={{ height: '100%', width: '100%', borderRadius: 'calc(var(--radius-xl) - 0.5rem)' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                {cities.map((city) => (
                    <Marker key={city.slug} position={[city.lat, city.lng] as any}>
                        <Popup>
                            <div style={{ padding: '0.5rem', minWidth: '150px' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 800 }}>{city.city}</h3>
                                <p style={{ margin: '0 0 1rem 0', color: 'var(--muted)', fontSize: '0.875rem' }}>{city.country}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Score: {city.cost_index}</span>
                                    <Link href={`/city/${city.slug}`} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}>
                                        View →
                                    </Link>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
