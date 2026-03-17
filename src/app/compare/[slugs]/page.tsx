'use client';

import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { City } from '@/types/database';
import Link from 'next/link';
import CityCard from '@/components/CityCard';
import SideBySideChart from '@/components/SideBySideChart';
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

    const costChartData = [
        { category: 'Overall Cost Index', city1Value: city1.cost_index, city2Value: city2.cost_index, city1Name: city1.city, city2Name: city2.city },
        { category: 'Rent Index', city1Value: city1.rent_index, city2Value: city2.rent_index, city1Name: city1.city, city2Name: city2.city },
        { category: 'Food Index', city1Value: city1.food_index, city2Value: city2.food_index, city1Name: city1.city, city2Name: city2.city },
        { category: 'Transport', city1Value: city1.transport_index, city2Value: city2.transport_index, city1Name: city1.city, city2Name: city2.city },
    ];

    const qualityChartData = [
        { category: 'Safety Score', city1Value: city1.safety, city2Value: city2.safety, city1Name: city1.city, city2Name: city2.city },
        { category: 'Healthcare', city1Value: city1.healthcare || 70, city2Value: city2.healthcare || 70, city1Name: city1.city, city2Name: city2.city },
        { category: 'Internet', city1Value: city1.internet, city2Value: city2.internet, city1Name: city1.city, city2Name: city2.city },
        { category: 'Environment', city1Value: city1.environment || 65, city2Value: city2.environment || 65, city1Name: city1.city, city2Name: city2.city }
    ];

    return (
        <div className="compare-page container section animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontWeight: 900, fontSize: '4.5rem', letterSpacing: '-0.04em' }}>
                    <span style={{ color: 'var(--primary)' }}>{city1.city}</span> <span style={{ color: 'var(--muted)', fontSize: '2.5rem', margin: '0 1rem' }}>vs</span> <span style={{ color: 'var(--accent)' }}>{city2.city}</span>
                </h1>
                <p style={{ color: 'var(--muted)', fontSize: '1.25rem', marginTop: '1rem', fontWeight: 500 }}>Detailed side-by-side analysis of living standards and costs.</p>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '3rem', marginBottom: '4rem' }}>
                {/* Financial Comparison */}
                <div className="card" style={{ padding: '3rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem', color: 'var(--foreground)', fontWeight: 900, letterSpacing: '-0.02em', textAlign: 'center' }}>
                        Financial Breakdown
                    </h2>
                    <SideBySideChart data={costChartData as any} />
                </div>

                {/* Quality of Life Comparison */}
                <div className="card" style={{ padding: '3rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem', color: 'var(--foreground)', fontWeight: 900, letterSpacing: '-0.02em', textAlign: 'center' }}>
                        Quality of Life Factors
                    </h2>
                    <SideBySideChart data={qualityChartData as any} />
                </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '3rem' }}>
                <div style={{ width: '450px' }}><CityCard city={city1} /></div>
                <div style={{ width: '450px' }}><CityCard city={city2} /></div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '5rem' }}>
                <Link href="/compare" className="btn" style={{ padding: '1.25rem 3rem', background: 'var(--foreground)', color: 'white', fontWeight: 800, borderRadius: 'var(--radius-lg)', letterSpacing: '0.02em', boxShadow: 'var(--shadow-md)' }}>
                    Make Another Comparison
                </Link>
            </div>
        </div>
    );
}
