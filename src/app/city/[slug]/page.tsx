'use client';

import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { City } from '@/types/database';
import WeatherWidget from '@/components/WeatherWidget';
import Link from 'next/link';
import { useCurrency } from '@/context/CurrencyContext';
import React, { useEffect, useState, use } from 'react';
import CostBreakdownChart from '@/components/CostBreakdownChart';
import QualityScoreChart from '@/components/QualityScoreChart';

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

    const dynamicImage = `https://source.unsplash.com/featured/1600x900?${encodeURIComponent(city.city)}+skyline`;

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
                    backgroundImage: `linear-gradient(rgba(0,0,0,0) 40%, rgba(34,34,34,0.85)), url(${dynamicImage}), url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1200)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />
                <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
                    <h1 style={{ marginBottom: '0.75rem', fontSize: '5rem', fontWeight: 900, letterSpacing: '-0.05em' }}>{city.city}</h1>
                    <p style={{ fontSize: '1.5rem', opacity: 0.9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{city.country} • {city.population.toLocaleString()} Residents</p>
                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                        <span style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: 'var(--shadow-md)' }}>
                            Cost Index: {city.cost_index}
                        </span>
                        <WeatherWidget lat={city.lat} lng={city.lng} cityName={city.city} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '3rem' }}>
                {/* Cost Section */}
                <section className="card" style={{ padding: '3rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--foreground)', fontWeight: 900, letterSpacing: '-0.02em' }}>
                            Financial Breakdown
                        </h2>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Est. Monthly Total</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)' }}>{formatValue(city.cost_index * 30)}</div>
                        </div>
                    </div>

                    <CostBreakdownChart
                        metrics={{
                            rent: city.rent_index * 10,
                            food: city.food_index * 5,
                            transport: city.transport_index * 2,
                            utilities: city.utilities_index * 3
                        }}
                    />
                </section>

                {/* Quality Section */}
                <section className="card" style={{ padding: '3rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--foreground)', fontWeight: 900, letterSpacing: '-0.02em' }}>
                        Quality of Life Profile
                    </h2>

                    <QualityScoreChart
                        scores={{
                            safety: city.safety,
                            healthcare: city.healthcare || 70,
                            internet: city.internet,
                            environment: city.environment || 65
                        }}
                    />

                    <div style={{ marginTop: '2rem' }}>
                        <Link href={`/city/${city.slug}/things-to-do`} className="btn" style={{ width: '100%', padding: '1.25rem', background: 'var(--secondary)', color: 'white', fontWeight: 800, borderRadius: 'var(--radius-md)', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'background 0.2s', textAlign: 'center' }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}>
                            Explore Local Experiences
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
