'use client';

import Link from 'next/link';
import Translator from './Translator';
import { useCurrency } from '@/context/CurrencyContext';

export default function Header() {
    return (
        <header className="header" style={{
            padding: '1.25rem 0',
            backgroundColor: 'var(--background)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: 'var(--foreground)',
                    letterSpacing: '-0.02em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    Roam<span style={{ color: 'var(--primary)' }}>Cost</span>
                </Link>

                <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link href="/" style={{ fontWeight: 600, color: 'var(--muted)', fontSize: '1rem', transition: 'color 0.2s' }}>Home</Link>
                    <Link href="/rankings/quality" style={{ fontWeight: 600, color: 'var(--muted)', fontSize: '1rem', transition: 'color 0.2s' }}>Rankings</Link>
                    <Link href="/compare" style={{ fontWeight: 600, color: 'var(--muted)', fontSize: '1rem', transition: 'color 0.2s' }}>Compare</Link>
                    <Link href="/rankings/nomads" style={{ fontWeight: 600, color: 'var(--muted)', fontSize: '1rem', transition: 'color 0.2s' }}>Nomads</Link>
                </nav>
            </div>
        </header>
    );
}
