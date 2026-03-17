'use client';

import { useState } from 'react';
import { City } from '@/types/database';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import CityCard from '@/components/CityCard';
import dynamic from 'next/dynamic';

const WorldMap = dynamic(() => import('@/components/WorldMap'), {
    ssr: false,
    loading: () => <div style={{ height: '600px', backgroundColor: 'var(--accent)', borderRadius: 'var(--radius-xl)', opacity: 0.5 }} />
});

interface HomeClientProps {
    featuredCities: City[];
    cheapestCities: City[];
    topNomadCities: City[];
    mapCities: City[];
}

type Persona = 'nomad' | 'family';

export default function HomeClient({
    featuredCities,
    cheapestCities,
    topNomadCities,
    mapCities
}: HomeClientProps) {
    const [persona, setPersona] = useState<Persona>('nomad');

    return (
        <div className="homepage">
            {/* Hero Section */}
            <section className="hero" style={{
                padding: '10rem 0 12rem',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'var(--primary)',
            }}>
                {/* Dynamic Global Background Image */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                    backgroundImage: 'linear-gradient(rgba(34, 34, 34, 0.7), rgba(34, 34, 34, 0.9)), url(https://source.unsplash.com/1920x1080/?travel,skyline,city)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />

                <div className="container animate-fade-in" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    {/* Persona Switcher */}
                    <div style={{
                        display: 'inline-flex',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(16px)',
                        padding: '0.4rem',
                        borderRadius: 'var(--radius-xl)',
                        marginBottom: '3rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <button
                            onClick={() => setPersona('nomad')}
                            style={{
                                padding: '0.75rem 1.75rem',
                                borderRadius: 'var(--radius-lg)',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                color: persona === 'nomad' ? 'var(--foreground)' : 'white',
                                background: persona === 'nomad' ? 'white' : 'transparent',
                                transition: 'all 0.3s ease',
                                boxShadow: persona === 'nomad' ? 'var(--shadow-md)' : 'none'
                            }}
                        >
                            Digital Nomad
                        </button>
                        <button
                            onClick={() => setPersona('family')}
                            style={{
                                padding: '0.75rem 1.75rem',
                                borderRadius: 'var(--radius-lg)',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                color: persona === 'family' ? 'var(--foreground)' : 'white',
                                background: persona === 'family' ? 'white' : 'transparent',
                                transition: 'all 0.3s ease',
                                boxShadow: persona === 'family' ? 'var(--shadow-md)' : 'none'
                            }}
                        >
                            Family Relocation
                        </button>
                    </div>

                    <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.04em', color: 'white' }}>
                        Find Your Perfect <br />
                        <span style={{ color: 'var(--primary)' }}>Global Base.</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto 4rem', fontWeight: 500 }}>
                        {persona === 'nomad'
                            ? "Data-driven insights on internet speeds, rentals, and safety for remote professionals."
                            : "Comprehensive quality of life, healthcare, and safety metrics for your family's next move."
                        }
                    </p>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <SearchBar persona={persona} />
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main style={{ marginTop: '-6rem', position: 'relative', zIndex: 10 }}>
                {/* Map Section */}
                <section className="container" style={{ marginBottom: '6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>Global Insights</span>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem' }}>Interactive Hub Explorer</h2>
                    </div>
                    <WorldMap cities={mapCities} />
                </section>

                {/* Featured Section */}
                <section className="container" style={{ marginBottom: '8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                                {persona === 'nomad' ? 'Premier Nomad Hubs' : 'Top Family Destinations'}
                            </h2>
                            <p style={{ color: 'var(--muted)', fontSize: '1.125rem' }}>
                                Recognizing the highest-quality destinations with stable infrastructure.
                            </p>
                        </div>
                        <Link href="/rankings/quality" style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1rem' }}>Global Rankings →</Link>
                    </div>
                    <div className="grid grid-cols-4">
                        {(persona === 'nomad' ? topNomadCities : featuredCities).map(city => (
                            <CityCard key={city.slug} city={city} persona={persona} />
                        ))}
                    </div>
                </section>

                {/* Categories Section - Clean & Spaced */}
                <section style={{ background: 'var(--accent)', padding: '8rem 0', borderRadius: 'var(--radius-xl)' }}>
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Curated Insights</h2>
                            <p style={{ color: 'var(--muted)', fontSize: '1.25rem' }}>Select the criteria that matters most to you.</p>
                        </div>
                        <div className="grid grid-cols-3">
                            <Link href="/rankings/safest" className="card" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Safety Standards</h3>
                                <p style={{ color: 'var(--muted)', marginBottom: 0 }}>Secure cities analyzed by crime rates and stability.</p>
                            </Link>
                            <Link href="/rankings/cheapest" className="card" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Yield & Value</h3>
                                <p style={{ color: 'var(--muted)', marginBottom: 0 }}>Optimize your runway in high-value global locales.</p>
                            </Link>
                            <Link href="/compare" className="card" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', background: 'var(--primary)', color: 'white' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Side-by-Side Analysis</h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 0 }}>Directly compare specific cities with detailed data cards.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Secondary Featured Section */}
                <section className="container" style={{ padding: '8rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>Value Picks</h2>
                            <p style={{ color: 'var(--muted)', fontSize: '1.125rem' }}>High standard of living for a fraction of the cost.</p>
                        </div>
                        <Link href="/rankings/cheapest" style={{ color: 'var(--primary)', fontWeight: 800 }}>View Value Rankings →</Link>
                    </div>
                    <div className="grid grid-cols-4">
                        {cheapestCities.map(city => (
                            <CityCard key={city.slug} city={city} persona={persona} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
