'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import L from 'leaflet';

// Fix for default marker icons in Leaflet + Next.js using DivIcon for stability and custom look
const createCustomIcon = (costIndex: number) => {
    // Determine color based on cost index (Cyan for low, Indigo for high)
    const color = costIndex > 50 ? '#2A41CB' : '#00D1FF';
    return L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="
            background-color: ${color};
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
    });
};

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
        return <div style={{ height: '600px', backgroundColor: 'var(--muted-light)', borderRadius: 'var(--radius-xl)' }} />;
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
                    <Marker
                        key={city.slug}
                        position={[city.lat, city.lng] as any}
                        icon={createCustomIcon(city.cost_index)}
                    >
                        <Popup>
                            <div style={{ padding: '0.5rem', minWidth: '160px', fontFamily: "'Inter', sans-serif" }}>
                                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 900, color: 'var(--headline)' }}>{city.city}</h3>
                                <p style={{ margin: '0 0 0.75rem 0', color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{city.country}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>Score</span>
                                        <span style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1rem' }}>{city.cost_index}</span>
                                    </div>
                                    <Link
                                        href={`/city/${city.slug}`}
                                        style={{
                                            backgroundColor: 'var(--primary)',
                                            color: 'white',
                                            padding: '0.4rem 0.8rem',
                                            fontSize: '0.75rem',
                                            borderRadius: 'var(--radius-sm)',
                                            fontWeight: 700
                                        }}
                                    >
                                        Explore
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
