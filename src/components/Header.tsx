'use client';

import Link from 'next/link';
import Translator from './Translator';
import { useCurrency } from '@/context/CurrencyContext';

export default function Header() {
    const { currency, setCurrency } = useCurrency();

    return (
        <header className="header" style={{
            padding: '2rem 0',
            backgroundColor: 'var(--background)',
            zIndex: 100,
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: 'var(--headline)',
                    letterSpacing: '-0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#105e4e' }}>
                        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    RoamCost
                </Link>

                <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link href="/" style={{ fontWeight: 600, color: 'var(--muted)', fontSize: '0.95rem' }}>Home</Link>
                    <Link href="/rankings/quality" style={{ fontWeight: 600, color: 'var(--muted)', fontSize: '0.95rem' }}>Rankings</Link>
                    <Link href="/compare" style={{ fontWeight: 600, color: 'var(--muted)', fontSize: '0.95rem' }}>Calculator</Link>
                    <Link href="/rankings/nomads" style={{ fontWeight: 600, color: 'var(--muted)', fontSize: '0.95rem' }}>Nomad Cities</Link>
                </nav>
            </div>
        </header>
    );
}
