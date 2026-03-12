import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { City } from '@/types/database';

interface ThingsToDoProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getFoursquarePlaces(lat: number, lng: number) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: process.env.FOURSQUARE_API_KEY!,
        }
    };

    try {
        const response = await fetch(
            `https://api.foursquare.com/v3/places/search?ll=${lat},${lng}&limit=12&categories=16000,10000,19000`, // landmarks, arts, travel
            options
        );
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Foursquare API Error:', error);
        return [];
    }
}

export default async function ThingsToDoPage({ params }: ThingsToDoProps) {
    const { slug } = await params;
    const { data: city, error } = await supabase
        .from('cities_master')
        .select('*')
        .eq('slug', slug)
        .single() as unknown as { data: City; error: any };

    if (error || !city) {
        notFound();
    }

    const places = await getFoursquarePlaces(city.lat, city.lng);

    return (
        <div className="container section animate-fade-in">
            <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>Local Experiences</span>
                <h1 style={{ marginTop: '0.5rem', fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Explore {city.city}</h1>
                <p style={{ color: 'var(--muted)', fontSize: '1.25rem', fontWeight: 500, maxWidth: '600px', margin: '0.75rem auto 0' }}>Discover the most significant landmarks and cultural hubs in {city.city}.</p>
            </div>

            {places.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '5rem', borderRadius: 'var(--radius-xl)' }}>
                    <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>We couldn't find any specific landmarks for this area right now. Try exploring the central district.</p>
                </div>
            ) : (
                <div className="grid grid-cols-3" style={{ gap: '2.5rem' }}>
                    {places.map((place: any) => (
                        <div key={place.fsq_id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: 'none', boxShadow: 'var(--shadow-md)' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                                    {place.categories?.[0]?.name || 'Attraction'}
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{place.name}</h3>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 500 }}>
                                {place.location?.address || 'Central District'}
                            </p>
                            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-start' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: 'var(--muted-light)', color: 'var(--muted)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {Math.round(place.distance / 100) / 10} km from origin
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '6rem', textAlign: 'center' }}>
                <Link href={`/city/${city.slug}`} className="btn" style={{ padding: '1rem 3rem', background: 'var(--primary)', color: 'white', fontWeight: 800, borderRadius: 'var(--radius-md)' }}>
                    Return to Overview
                </Link>
            </div>
        </div>
    );
}
