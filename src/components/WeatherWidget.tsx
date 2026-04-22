'use client';

import { useState, useEffect } from 'react';

interface WeatherProps {
    lat: number | null;
    long: number | null;
}

export default function WeatherWidget({ lat, long }: WeatherProps) {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!lat || !long) { setLoading(false); return; }
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`)
            .then(r => r.json())
            .then(data => setWeather(data.current_weather))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [lat, long]);

    if (loading) return (
        <div style={{ height: '38px', width: '140px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '2rem' }} />
    );
    if (!weather) return null;

    const icon = weather.temperature > 25 ? '☀️' : weather.temperature > 15 ? '⛅' : weather.temperature > 5 ? '🌥️' : '❄️';

    return (
        <span style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.6rem 1.25rem', borderRadius: '2rem',
            backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
            color: 'white', fontWeight: 700
        }}>
            {icon} {Math.round(weather.temperature)}°C
        </span>
    );
}
