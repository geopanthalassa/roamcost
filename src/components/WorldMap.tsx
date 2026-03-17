'use client';

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import L from 'leaflet';

const createCustomIcon = (costIndex: number) => {
    let color = '#3EB489'; // Mint Green (cheap, < 45)
    if (costIndex >= 45 && costIndex < 75) color = '#FF8C42'; // Orange (medium)
    if (costIndex >= 75) color = '#ef4444'; // Red (expensive)
    return L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="
            background-color: ${color};
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            transition: transform 0.2s;
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
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
        <div className="card" style={{ padding: '0.5rem', overflow: 'hidden', height: '600px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)' }}>
            <MapContainer
                center={[20, 0] as any}
                zoom={2.5}
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
                        <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                            <div style={{ fontSize: '0.85rem', fontFamily: "'Inter', sans-serif" }}>
                                <strong style={{ display: 'block', color: 'var(--foreground)' }}>{city.city}, {city.country}</strong>
                                <span style={{ color: 'var(--muted)' }}>Cost Index: {city.cost_index}</span>
                            </div>
                        </Tooltip>
                        <Popup className="custom-popup">
                            <div style={{ padding: '0', minWidth: '220px', fontFamily: "'Inter', sans-serif", overflow: 'hidden', borderRadius: '8px' }}>
                                <div style={{
                                    height: '120px',
                                    backgroundImage: `url(https://source.unsplash.com/400x300/?${encodeURIComponent(city.city)}+skyline)`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderTopLeftRadius: '6px',
                                    borderTopRightRadius: '6px'
                                }} />
                                <div style={{ padding: '1rem' }}>
                                    <h3 style={{ margin: '0 0 0.15rem 0', fontSize: '1.1rem', fontWeight: 900, color: 'var(--foreground)' }}>{city.city}</h3>
                                    <p style={{ margin: '0 0 0.75rem 0', color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{city.country}</p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>Score</span>
                                            <span style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1.25rem', lineHeight: 1 }}>{city.cost_index}</span>
                                        </div>
                                        <Link
                                            href={`/city/${city.slug}`}
                                            style={{
                                                backgroundColor: 'var(--accent)',
                                                color: 'white',
                                                padding: '0.5rem 1rem',
                                                fontSize: '0.8rem',
                                                borderRadius: 'var(--radius-sm)',
                                                fontWeight: 800,
                                                letterSpacing: '0.02em',
                                                transition: 'background-color 0.2s',
                                                textDecoration: 'none'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e07a38'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
                                        >
                                            Explore
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <style>{`
                .custom-popup .leaflet-popup-content-wrapper { padding: 0; overflow: hidden; border-radius: 8px; box-shadow: var(--shadow-xl); }
                .custom-popup .leaflet-popup-content { margin: 0; width: 220px !important; }
            `}</style>
        </div>
    );
}
