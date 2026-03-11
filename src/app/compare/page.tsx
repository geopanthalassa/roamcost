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
            <div style={{ marginBottom: '5rem' }}>
                <h1 style={{
                    fontSize: '5.5rem',
                    fontWeight: 800,
                    color: 'var(--headline)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.04em',
                    marginBottom: '2rem'
                }}>
                    Compare the <span style={{ color: '#5b8c71' }}>cost of living</span> <br />
                    between any two cities
                </h1>
                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--muted)',
                    maxWidth: '600px',
                    margin: '0 auto',
                    fontWeight: 500
                }}>
                    Explore rent, food, transport, safety, climate and more. Plan your next move or trip with real data.
                </p>
            </div>

            {/* Selector Row */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
            }}>
                {/* First Search Input */}
                <div style={{ position: 'relative', width: '300px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder={city1 ? `${city1.city}, ${city1.country}` : "Select city"}
                            value={search1}
                            onChange={(e) => setSearch1(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1.25rem 1.5rem',
                                borderRadius: '1rem',
                                border: '1px solid #e0e6e4',
                                fontSize: '1.1rem',
                                fontWeight: 500,
                                background: '#fff',
                                outline: 'none'
                            }}
                        />
                        <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>⌄</div>
                    </div>
                    {results1.length > 0 && (
                        <div className="card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, marginTop: '0.5rem', textAlign: 'left' }}>
                            {results1.map(city => (
                                <button key={city.slug} onClick={() => { setCity1(city); setResults1([]); setSearch1(''); }} style={{ width: '100%', padding: '0.75rem', borderBottom: '1px solid #eee', fontSize: '1rem' }}>
                                    {city.city}, {city.country}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Swap Icon */}
                <div style={{ fontSize: '1.5rem', color: 'var(--muted)', margin: '0 0.5rem' }}>⇄</div>

                {/* Second Search Input */}
                <div style={{ position: 'relative', width: '300px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder={city2 ? `${city2.city}, ${city2.country}` : "Select city"}
                            value={search2}
                            onChange={(e) => setSearch2(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1.25rem 1.5rem',
                                borderRadius: '1rem',
                                border: '1px solid #e0e6e4',
                                fontSize: '1.1rem',
                                fontWeight: 500,
                                background: '#fff',
                                outline: 'none'
                            }}
                        />
                        <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>⌄</div>
                    </div>
                    {results2.length > 0 && (
                        <div className="card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, marginTop: '0.5rem', textAlign: 'left' }}>
                            {results2.map(city => (
                                <button key={city.slug} onClick={() => { setCity2(city); setResults2([]); setSearch2(''); }} style={{ width: '100%', padding: '0.75rem', borderBottom: '1px solid #eee', fontSize: '1rem' }}>
                                    {city.city}, {city.country}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Compare Button */}
                <button
                    onClick={handleCompare}
                    disabled={!city1 || !city2}
                    style={{
                        padding: '1.25rem 3rem',
                        background: '#9fb8b0',
                        color: '#fff',
                        borderRadius: '0.875rem',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: (!city1 || !city2) ? 'not-allowed' : 'pointer',
                        opacity: (!city1 || !city2) ? 0.7 : 1,
                        transition: 'all 0.2s',
                        marginLeft: '0.5rem'
                    }}
                >
                    Compare
                </button>
            </div>
        </div>
    );
}
