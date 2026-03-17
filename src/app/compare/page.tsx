'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { City } from '@/types/database';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CompareLandingPage() {
    const [search1, setSearch1] = useState('');
    const [search2, setSearch2] = useState('');
    const [results1, setResults1] = useState<City[]>([]);
    const [results2, setResults2] = useState<City[]>([]);
    const [city1, setCity1] = useState<City | null>(null);
    const [city2, setCity2] = useState<City | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (search1.length > 2) {
            handleSearch(search1, setResults1);
        } else {
            setResults1([]);
        }
    }, [search1]);

    useEffect(() => {
        if (search2.length > 2) {
            handleSearch(search2, setResults2);
        } else {
            setResults2([]);
        }
    }, [search2]);

    const handleSearch = async (query: string, setter: (cities: City[]) => void) => {
        const { data } = await supabase
            .from('cities_master')
            .select('*')
            .ilike('city', `%${query}%`)
            .gt('population', 300000)
            .order('population', { ascending: false })
            .limit(5);
        setter((data as City[]) || []);
    };

    const handleCompare = () => {
        if (city1 && city2) {
            router.push(`/compare/${city1.slug}-vs-${city2.slug}`);
        }
    };

    return (
        <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
            {/* Minimalist Hero Section */}
            <div style={{ marginBottom: '6rem' }}>
                <h1 style={{
                    fontSize: '5rem',
                    fontWeight: 900,
                    color: 'var(--foreground)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.04em',
                    marginBottom: '1.5rem'
                }}>
                    Compare <span style={{ color: 'var(--primary)' }}>Real Costs</span> <br />
                    Anywhere
                </h1>
                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--muted)',
                    maxWidth: '650px',
                    margin: '0 auto',
                    fontWeight: 500
                }}>
                    Instantly analyze rent, groceries, safety, and infrastructure between any two cities globally.
                </p>
            </div>

            {/* Selector Row */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap'
            }}>
                {/* First Search Input */}
                <div style={{ position: 'relative', width: '320px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder={city1 ? `${city1.city}, ${city1.country}` : "Select destination A..."}
                            value={search1}
                            onChange={(e) => setSearch1(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1.25rem 1.75rem',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border)',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                background: 'white',
                                outline: 'none',
                                color: 'var(--foreground)',
                                boxShadow: 'var(--shadow-sm)'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                e.currentTarget.style.borderColor = 'var(--primary)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                e.currentTarget.style.borderColor = 'var(--border)';
                            }}
                        />
                        <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                        </div>
                    </div>
                    {results1.length > 0 && (
                        <div className="card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, marginTop: '0.5rem', textAlign: 'left', padding: '0.5rem', boxShadow: 'var(--shadow-lg)' }}>
                            {results1.map(city => (
                                <button key={city.slug} onClick={() => { setCity1(city); setResults1([]); setSearch1(''); }} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)', textAlign: 'left', fontSize: '1rem', fontWeight: 600, transition: 'background-color 0.2s', color: 'var(--foreground)' }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--muted-light)'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    {city.city}, <span style={{ color: 'var(--muted)' }}>{city.country}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Swap Icon */}
                <div style={{ padding: '1rem', color: 'var(--muted)', background: 'var(--muted-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="14" x2="21" y2="3"></line><polyline points="8 21 3 21 3 16"></polyline><line x1="20" y1="10" x2="3" y2="21"></line></svg>
                </div>

                {/* Second Search Input */}
                <div style={{ position: 'relative', width: '320px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder={city2 ? `${city2.city}, ${city2.country}` : "Select destination B..."}
                            value={search2}
                            onChange={(e) => setSearch2(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1.25rem 1.75rem',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border)',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                background: 'white',
                                outline: 'none',
                                color: 'var(--foreground)',
                                boxShadow: 'var(--shadow-sm)'
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                e.currentTarget.style.borderColor = 'var(--primary)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                e.currentTarget.style.borderColor = 'var(--border)';
                            }}
                        />
                        <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                        </div>
                    </div>
                    {results2.length > 0 && (
                        <div className="card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, marginTop: '0.5rem', textAlign: 'left', padding: '0.5rem', boxShadow: 'var(--shadow-lg)' }}>
                            {results2.map(city => (
                                <button key={city.slug} onClick={() => { setCity2(city); setResults2([]); setSearch2(''); }} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)', textAlign: 'left', fontSize: '1rem', fontWeight: 600, transition: 'background-color 0.2s', color: 'var(--foreground)' }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--muted-light)'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    {city.city}, <span style={{ color: 'var(--muted)' }}>{city.country}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Compare Button */}
                <button
                    onClick={handleCompare}
                    disabled={!city1 || !city2}
                    className="btn"
                    style={{
                        padding: '1.25rem 3.5rem',
                        background: 'var(--accent)',
                        color: 'white',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        border: 'none',
                        cursor: (!city1 || !city2) ? 'not-allowed' : 'pointer',
                        opacity: (!city1 || !city2) ? 0.6 : 1,
                        transition: 'all 0.2s',
                        marginLeft: '1rem',
                        letterSpacing: '0.02em',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                    onMouseOver={(e) => {
                        if (city1 && city2) {
                            e.currentTarget.style.backgroundColor = '#e07a38';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        }
                    }}
                    onMouseOut={(e) => {
                        if (city1 && city2) {
                            e.currentTarget.style.backgroundColor = 'var(--accent)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                        }
                    }}
                >
                    Compare
                </button>
            </div>
        </div>
    );
}
