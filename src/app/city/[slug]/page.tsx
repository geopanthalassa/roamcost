'use client';

import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { City } from '@/types/database';
import WeatherWidget from '@/components/WeatherWidget';
import Link from 'next/link';
import { useCurrency } from '@/context/CurrencyContext';
import React, { useEffect, useState, use } from 'react';

interface CityPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function CityPage({ params }: CityPageProps) {
    const { formatValue } = useCurrency();
    const resolvedParams = use(params);
    const [city, setCity] = useState<City | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase
                .from('cities_master')
                .select('*')
                .eq('slug', resolvedParams.slug)
                .single();
            setCity(data as any as City);
            setLoading(false);
        };
        fetchData();
    }, [resolvedParams.slug]);

    if (loading) return <div className="container section">Loading city details...</div>;
    if (!city) notFound();

    const costMetrics = [
        { label: 'Rent Index', value: city.rent_index, color: 'var(--primary)', isPrice: true, factor: 10 },
        { label: 'Food Index', value: city.food_index, color: 'var(--secondary)', isPrice: true, factor: 5 },
        { label: 'Transport', value: city.transport_index, color: 'var(--accent)', isPrice: true, factor: 2 },
        { label: 'Utilities', value: city.utilities_index, color: '#6366f1', isPrice: true, factor: 3 },
    ];

    const qualityMetrics = [
        { label: 'Safety Index', value: city.safety },
        { label: 'Healthcare Quality', value: city.healthcare },
        { label: 'Connectivity', value: city.internet },
        { label: 'Environment Score', value: city.environment },
    ];

    const dynamicImage = `https://source.unsplash.com/featured/1200x600?${encodeURIComponent(city.city)},${encodeURIComponent(city.country)},landmark`;

    return (
        <div className="city-page container section animate-fade-in">
            {/* Hero Section */}
            <div className="city-hero card" style={{
                padding: '4rem',
                marginBottom: '4rem',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '450px',
                display: 'flex',
                alignItems: 'flex-end',
                border: 'none',
                boxShadow: 'var(--shadow-lg)',
                borderRadius: 'var(--radius-xl)'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `linear-gradient(rgba(0,0,0,0) 40%, rgba(0,0,0,0.7)), url(${dynamicImage}), url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1200)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />
                <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
                    <h1 style={{ marginBottom: '0.75rem', fontSize: '5rem', fontWeight: 900, letterSpacing: '-0.05em' }}>{city.city}</h1>
                    <p style={{ fontSize: '1.5rem', opacity: 0.9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{city.country} • {city.population.toLocaleString()} Residents</p>
                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                        <span style={{ backgroundColor: 'var(--secondary)', color: 'var(--foreground)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Quality Index: {city.cost_index}
                        </span>
                        <WeatherWidget lat={city.lat} lng={city.lng} cityName={city.city} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '3rem' }}>
                {/* Cost Section */}
                <section className="card" style={{ padding: '3rem', border: 'none', boxShadow: 'var(--shadow-md)' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem', color: 'var(--primary)', fontWeight: 900, letterSpacing: '-0.02em' }}>
                        Financial Requirements
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {costMetrics.map((metric) => (
                            <div key={metric.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <span style={{ color: 'var(--muted)' }}>{metric.label}</span>
                                    <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>{formatValue(metric.value * metric.factor)}</span>
                                </div>
                                <div style={{ height: '8px', backgroundColor: 'var(--muted-light)', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${Math.min(metric.value, 100)}%`,
                                        background: `linear-gradient(90deg, ${metric.color} 0%, var(--secondary) 100%)`,
                                        borderRadius: '10px'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quality Section */}
                <section className="card" style={{ padding: '3rem', border: 'none', boxShadow: 'var(--shadow-md)' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem', color: 'var(--primary)', fontWeight: 900, letterSpacing: '-0.02em' }}>
                        Infrastructure Quality
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1.5rem'
                    }}>
                        {qualityMetrics.map((metric) => (
                            <div key={metric.label} style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--muted-light)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.25rem', letterSpacing: '-0.04em' }}>{metric.value}</div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{metric.label}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <Link href={`/city/${city.slug}/things-to-do`} className="btn" style={{ width: '100%', padding: '1.5rem', background: 'var(--primary)', color: 'white', fontWeight: 800, borderRadius: 'var(--radius-md)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Local Experiences Breakdown
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
