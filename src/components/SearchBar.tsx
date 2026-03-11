'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { City } from '@/types/database';
import Link from 'next/link';

interface SearchBarProps {
    persona?: 'nomad' | 'family';
}

export default function SearchBar({ persona = 'nomad' }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<City[]>([]);
    const [loading, setLoading] = useState(false);

    const searchCities = async (searchTerm: string) => {
        if (searchTerm.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        const { data } = await supabase
            .from('cities_master')
            .select('*')
            .or(`city.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%`)
            .order('population', { ascending: false })
            .limit(10);

        if (data) setResults(data as any as City[]);
        setLoading(false);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => searchCities(query), 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && results.length > 0) {
            window.location.href = `/city/${results[0].slug}`;
        }
    };

    return (
        <div className="search-container" style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ position: 'relative' }}>
                <span style={{
                    position: 'absolute',
                    left: '1.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '1.5rem',
                    pointerEvents: 'none',
                    opacity: 0.8
                }}>
                    {persona === 'nomad' ? '✈️' : '🏠'}
                </span>
                <input
                    type="text"
                    placeholder={persona === 'nomad' ? "Find your next coworking paradise..." : "Find the perfect family home..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                        width: '100%',
                        padding: '1.5rem 2rem 1.5rem 4rem',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--glass-border)',
                        background: 'var(--glass)',
                        backdropFilter: 'blur(20px)',
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: 'var(--foreground)',
                        boxShadow: 'var(--glass-shadow)',
                        outline: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onFocus={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-xl)'}
                    onBlur={(e) => e.currentTarget.style.boxShadow = 'var(--glass-shadow)'}
                />
            </div>

            {results.length > 0 && (
                <div className="search-results" style={{
                    position: 'absolute',
                    top: 'calc(100% + 1rem)',
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    padding: '0.75rem',
                    background: 'var(--glass)',
                    backdropFilter: 'blur(30px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xl)',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    animation: 'fadeIn 0.3s ease-out forwards'
                }}>
                    {results.map((city) => (
                        <Link
                            key={city.slug}
                            href={`/city/${city.slug}`}
                            className="search-item"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1.25rem 1.5rem',
                                borderRadius: 'var(--radius-md)',
                                transition: 'all 0.2s ease',
                                marginBottom: '0.25rem'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--primary-glow)';
                                e.currentTarget.style.transform = 'translateX(4px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.transform = 'translateX(0)';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontSize: '1.5rem' }}>📍</span>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{city.city}</div>
                                    <div style={{ color: 'var(--muted)', fontSize: '0.875rem', fontWeight: 600 }}>{city.country}</div>
                                </div>
                            </div>
                            <div style={{
                                background: 'white',
                                padding: '0.4rem 0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: 800,
                                color: 'var(--primary)',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                Score: {city.cost_index}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
