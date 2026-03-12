import { supabase } from '@/lib/supabase';
import CityCard from '@/components/CityCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { City } from '@/types/database';

interface RegionalPageProps {
    params: Promise<{
        region: string;
    }>;
}

export const dynamic = 'force-dynamic';

export default async function BestCitiesInRegionPage({ params }: RegionalPageProps) {
    const { region } = await params;

    if (!region) {
        return notFound();
    }

    const regionName = region.replace(/-/g, ' ');

    const { data: cities } = await supabase
        .from('cities_master')
        .select('*')
        .ilike('country', regionName)
        .order('cost_index', { ascending: false })
        .limit(20) as unknown as { data: City[] };

    return (
        <div className="container section animate-fade-in">
            <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>Top Rankings</span>
                <h1 style={{ fontSize: '3.5rem', marginTop: '0.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Leading Cities in {regionName}</h1>
                <p style={{ color: 'var(--muted)', fontSize: '1.25rem', fontWeight: 500, maxWidth: '700px', margin: '0.75rem auto 0' }}>Comprehensive data on lifestyle standards and infrastructure in {regionName}.</p>
            </div>

            <div className="grid grid-cols-4">
                {cities?.map((city) => (
                    <CityCard key={city.slug} city={city} />
                ))}
            </div>

            {(!cities || cities.length === 0) && (
                <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <p>No cities found for this region.</p>
                </div>
            )}

            <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                <Link href="/" className="btn btn-outline">Back to Home</Link>
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: RegionalPageProps) {
    const { region } = await params;
    if (!region) return { title: 'Region Rankings | RoamCost' };
    const name = region.replace(/-/g, ' ').toUpperCase();
    return {
        title: `Best Cities to Live in ${name} | RoamCost`,
        description: `Ranking the top cities in ${name} by quality of life, safety, and internet speed.`,
    };
}
