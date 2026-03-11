'use client';

import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { City } from '@/types/database';
import Link from 'next/link';
import CityCard from '@/components/CityCard';
import { useCurrency } from '@/context/CurrencyContext';
import React, { useEffect, useState, use } from 'react';

interface ComparePageProps {
    params: Promise<{
        slugs: string;
    }>;
}

export default function ComparePage({ params }: ComparePageProps) {
    const { formatValue } = useCurrency();
    const resolvedParams = use(params);
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const slugs = resolvedParams.slugs;
        if (!slugs) return;
        const [slug1, slug2] = slugs.split('-vs-');
        if (!slug1 || !slug2) return;

        const fetchData = async () => {
            const { data } = await supabase
                .from('cities_master')
                .select('*')
                .in('slug', [slug1, slug2]);
            setCities((data as any as City[]) || []);
            setLoading(false);
        };
        fetchData();
    }, [resolvedParams.slugs]);

    if (loading) return <div className="container section">Loading comparison...</div>;

    const [slug1, slug2] = resolvedParams.slugs.split('-vs-');
    const city1 = cities.find(c => c.slug === slug1);
    const city2 = cities.find(c => c.slug === slug2);

    if (!city1 || !city2) {
        return (
            <div className="container section">
                <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <h2 style={{ color: 'var(--primary)' }}>Data not found</h2>
                    <p>We couldn't find enough data to compare these locations.</p>
                    <Link href="/compare" className="btn btn-primary" style={{ marginTop: '2rem' }}>Try Another Comparison</Link>
                </div>
            </div>
        );
    }

    const comparisonMetrics = [
        { label: 'Overall Quality Score', key: 'cost_index', isPrice: false },
        { label: 'Monthly Rent Est.', key: 'rent_index', isPrice: true, factor: 10 },
        { label: 'Food & Dining', key: 'food_index', isPrice: true, factor: 5 },
        { label: 'Transport', key: 'transport_index', isPrice: true, factor: 2 },
        { label: 'Safety Score', key: 'safety', isPrice: false },
        { label: 'Internet Speed', key: 'internet', isPrice: false },
        { label: 'Healthcare Quality', key: 'healthcare', isPrice: false },
    ];

    return (
        <div className="compare-page container section animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontWeight: 900, fontSize: '3.5rem' }}>
                    <span style={{ color: 'var(--primary)' }}>{city1.city}</span> <span style={{ color: 'var(--muted)', fontSize: '2rem' }}>vs</span> <span style={{ color: 'var(--primary)' }}>{city2.city}</span>
                </h1>
                <p style={{ color: 'var(--muted)', fontSize: '1.25rem' }}>Detailed side-by-side breakdown of living standards and costs.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                {/* Metric Labels Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'center', paddingRight: '2rem' }}>
                    {comparisonMetrics.map((metric) => (
                        <div key={metric.label}>
                            <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {metric.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* City 1 Column */}
                <div className="card" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '2px solid var(--primary-glow)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2.5rem' }}>{city1.city}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {comparisonMetrics.map((metric) => {
                            const raw = (city1 as any)[metric.key];
                            const val = metric.isPrice ? formatValue(raw * (metric.factor || 1)) : raw;
                            return (
                                <div key={metric.label}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>{val}</div>
                                    <div style={{ height: '6px', background: 'var(--muted-light)', borderRadius: '10px', marginTop: '0.5rem', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${Math.min(100, (raw / 100) * 100)}%`, background: 'var(--primary)', borderRadius: '10px' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* City 2 Column */}
                <div className="card" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2.5rem' }}>{city2.city}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {comparisonMetrics.map((metric) => {
                            const raw = (city2 as any)[metric.key];
                            const val = metric.isPrice ? formatValue(raw * (metric.factor || 1)) : raw;
                            return (
                                <div key={metric.label}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>{val}</div>
                                    <div style={{ height: '6px', background: 'var(--muted-light)', borderRadius: '10px', marginTop: '0.5rem', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${Math.min(100, (raw / 100) * 100)}%`, background: 'var(--primary)', borderRadius: '10px' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '6rem', display: 'flex', justifyContent: 'center', gap: '3rem' }}>
                <div style={{ width: '400px' }}><CityCard city={city1} /></div>
                <div style={{ width: '400px' }}><CityCard city={city2} /></div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <Link href="/compare" className="btn btn-outline" style={{ padding: '1rem 2.5rem' }}>Make New Comparison</Link>
            </div>
        </div>
    );
}
