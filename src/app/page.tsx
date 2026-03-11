import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { City } from '@/types/database';
import HomeClient from '@/components/HomeClient';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Fetch featured data for the homepage - Filtering for prominent cities with complete data
  const { data: featuredCities } = await supabase
    .from('cities_master')
    .select('*')
    .gt('population', 500000)
    .gt('cost_index', 0)
    .order('cost_index', { ascending: false })
    .limit(4) as unknown as { data: City[] };

  const { data: cheapestCities } = await supabase
    .from('cities_master')
    .select('*')
    .gt('population', 200000)
    .gt('rent_index', 0)
    .order('rent_index', { ascending: true })
    .limit(4) as unknown as { data: City[] };

  const { data: topNomadCities } = await supabase
    .from('cities_master')
    .select('*')
    .gt('population', 300000)
    .gt('internet', 0)
    .order('internet', { ascending: false })
    .limit(4) as unknown as { data: City[] };

  const { data: mapCities } = await supabase
    .from('cities_master')
    .select('city, country, lat, lng, slug, cost_index')
    .gt('population', 500000)
    .limit(50) as unknown as { data: City[] };

  return (
    <HomeClient
      featuredCities={featuredCities || []}
      cheapestCities={cheapestCities || []}
      topNomadCities={topNomadCities || []}
      mapCities={mapCities || []}
    />
  );
}
