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

    // High-fidelity image system with per-city seeding
    const cityImage = `https://source.unsplash.com/featured/800x600?${encodeURIComponent(city.city)},cityscape&sig=${city.slug}`;
    const fallbackImage = `https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80`;

    // Define metrics based on persona
    const metrics = persona === 'nomad'
        ? [
            { label: 'Internet', value: city.internet, max: 100, unit: 'Mbps' },
            { label: 'Rent', value: city.rent_index, max: 100, unit: '' },
            { label: 'Safety', value: city.safety, max: 100, unit: '%' }
        ]
        : [
            { label: 'Safety', value: city.safety, max: 100, unit: '%' },
            { label: 'Healthcare', value: city.healthcare || 70, max: 100, unit: '%' },
            { label: 'Environment', value: city.environment || 65, max: 100, unit: '%' }
        ];

    return (
        <Link href={`/city/${city.slug}`} className="card" style={{
            padding: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            border: 'none',
            boxShadow: 'var(--shadow-lg)',
            background: 'var(--card)',
            borderRadius: 'var(--radius-lg)',
            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease',
        }}>
            {/* Image Overlay with Score Badge */}
            <div style={{ position: 'relative', height: '220px' }}>
                <div style={{
                    height: '100%',
                    backgroundColor: 'var(--primary-glow)',
                    backgroundImage: `url(${cityImage}), url(${fallbackImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />
                <div style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.25rem',
                    background: 'var(--secondary)',
                    color: 'var(--foreground)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 900,
                    fontSize: '1rem',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: 2
                }}>
                    {city.cost_index}
                </div>
            </div>

            <div style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: 'var(--foreground)', letterSpacing: '-0.02em' }}>{city.city}</h3>
                    <p style={{ margin: 0, color: 'var(--muted)', fontSize: '1rem', fontWeight: 600 }}>{city.country}</p>
                </div>

                {/* Progress Bar Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                    {metrics.map((m) => (
                        <div key={m.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)' }}>
                                <span>{m.label}</span>
                                <span style={{ color: 'var(--primary)' }}>{m.value}{m.unit}</span>
                            </div>
                            <div style={{ height: '6px', background: 'var(--muted-light)', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${Math.min(100, (m.value / m.max) * 100)}%`,
                                    background: 'var(--primary)',
                                    borderRadius: '10px',
                                    transition: 'width 1s ease-out'
                                }} />
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: '2rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--muted)' }}>Est. Monthly</span>
                    <span style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--primary)' }}>
                        {formatValue(city.cost_index * 30)}
                    </span>
                </div>
            </div>
        </Link>
    );
}
