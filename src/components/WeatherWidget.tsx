'use client';

import { useState, useEffect } from 'react';

interface WeatherProps {
    lat: number;
    lng: number;
    cityName: string;
}

export default function WeatherWidget({ lat, lng, cityName }: WeatherProps) {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWeather() {
            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
                const data = await res.json();
                setWeather(data.current_weather);
            } catch (e) {
                console.error('Weather error:', e);
            } finally {
                setLoading(false);
            }
        }
        fetchWeather();
    }, [lat, lng]);

    if (loading) return <div className="animate-pulse" style={{ height: '100px', backgroundColor: 'var(--border)', borderRadius: 'var(--radius-md)' }} />;
    if (!weather) return null;

    const getWeatherIcon = (temp: number) => {
        if (temp > 25) return (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#FFD700' }}>
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
        );
        return (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#A0AEC0' }}>
                <path d="M17.5 19c2.3 0 4.5-1.9 4.5-4.5 0-2.3-1.7-4.2-3.9-4.5.2-.5.4-1.1.4-1.7 0-2.5-2-4.5-4.5-4.5-1.8 0-3.3 1.1-4 2.6C9.2 6.1 8.3 6 7.5 6 4.5 6 2 8.5 2 11.5 2 14.5 4.5 17 7.5 17h10" />
            </svg>
        );
    };

    return (
        <div className="card glass" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '0.75rem 1.25rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div>
                {getWeatherIcon(weather.temperature)}
            </div>
            <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Forecast</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>{weather.temperature}°C</div>
            </div>
        </div>
    );
}
