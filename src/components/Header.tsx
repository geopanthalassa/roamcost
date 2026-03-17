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
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {/* Globe Base */}
                        <circle cx="11" cy="13" r="8" />
                        <path d="M11 5c2.5 0 4.5 3.5 4.5 8s-2 8-4.5 8-4.5-3.5-4.5-8 2-8 4.5-8z" />
                        <path d="M3 13h16" />
                        {/* Orbital Airplane */}
                        <path d="M18.5 4.5L22 2l-1.5 3.5-2 1z" fill="var(--primary)" stroke="none" />
                        <path d="M20 4A11 11 0 0 0 2 16" strokeDasharray="3 3" opacity="0.6" />
                    </svg>
                    <span style={{ fontFamily: 'var(--font-inter, sans-serif)', letterSpacing: '-0.03em' }}>
                        Roam<span style={{ color: 'var(--primary)' }}>Cost</span>
                    </span>
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
