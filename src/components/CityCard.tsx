'use client';

import Link from 'next/link';
import { City } from '@/types/database';
import { useCurrency } from '@/context/CurrencyContext';

interface CityCardProps {
    city: City;
    persona?: 'nomad' | 'family';
}

export default function CityCard({ city, persona = 'nomad' }: CityCardProps) {
    const { formatValue } = useCurrency();

    // Unsplash skyline implementation
    const cityImage = `https://source.unsplash.com/1600x900/?${encodeURIComponent(city.city)}+skyline`;
    const fallbackImage = `https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80`;

    // Define metrics based on persona
    const metrics = persona === 'nomad'
        ? [
            { label: 'Internet', value: city.internet, max: 100, unit: 'Mbps' },
            { label: 'Safety', value: city.safety, max: 100, unit: '/100' }
        ]
        : [
            { label: 'Safety', value: city.safety, max: 100, unit: '/100' },
            { label: 'Healthcare', value: city.healthcare || 70, max: 100, unit: '/100' }
        ];

    return (
        <Link href={`/city/${city.slug}`} className="card" style={{
            padding: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            background: 'var(--card)',
            borderRadius: 'var(--radius-lg)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}>
            {/* Image Overlay */}
            <div style={{ position: 'relative', height: '200px' }}>
                <div style={{
                    height: '100%',
                    backgroundColor: 'var(--muted-light)',
                    backgroundImage: `linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.6)), url(${cityImage}), url(${fallbackImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'var(--accent)',
                    color: '#fff',
                    padding: '0.4rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    boxShadow: 'var(--shadow-sm)',
                    zIndex: 2,
                }}>
                    Index: {city.cost_index}
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '1.25rem',
                    zIndex: 2
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{city.city}</h3>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', fontWeight: 500, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{city.country}</p>
                </div>
            </div>

            <div style={{ padding: '1.5rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Est. Monthly
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--foreground)' }}>
                        {formatValue(city.cost_index * 30)}
                    </div>
                </div>

                {/* Progress Bar Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {metrics.map((m) => (
                        <div key={m.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)' }}>
                                <span>{m.label}</span>
                                <span style={{ color: 'var(--foreground)', fontWeight: 700 }}>{m.value}{m.unit}</span>
                            </div>
                            <div style={{ height: '6px', background: 'var(--muted-light)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${Math.min(100, (m.value / m.max) * 100)}%`,
                                    background: 'var(--primary)',
                                    borderRadius: '4px',
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Link>
    );
}
