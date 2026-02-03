'use client';

import Link from 'next/link';
// import Image from 'next/image'; // Décommenter quand le logo est disponible
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => {
        return pathname === path;
    };

    const navLinks = [
        { href: '/', label: 'Accueil' },
        { href: '/experiences', label: 'Expériences' },
        { href: '/ministere', label: 'Ministère' },
        { href: '/a-propos', label: 'À Propos' },
    ];

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo KUUNI - Remplacer par le vrai logo de Canva */}
                    <Link href="/" className="flex items-center gap-2">
                        {/* Emplacement pour le logo KUUNI depuis Canva */}
                        {/* Décommenter et remplacer le src quand le logo est disponible */}
                        {/* 
                        <Image 
                            src="/logo-kuuni.png" 
                            alt="KUUNI" 
                            width={120} 
                            height={40}
                            className="h-10 w-auto"
                        />
                        */}
                        {/* Logo texte temporaire */}
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-gray-800">KU</span>
                            <span className="text-2xl font-bold text-amber-600">UNI</span>
                        </div>
                    </Link>

                    {/* Navigation Desktop */}
                    <div className="hidden md:flex space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${isActive(link.href)
                                    ? 'text-amber-600 font-semibold'
                                    : 'text-gray-700 hover:text-amber-600'
                                    } transition`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/admin"
                            className={`${pathname?.startsWith('/admin')
                                ? 'text-amber-600 font-semibold'
                                : 'text-gray-700 hover:text-amber-600'
                                } transition`}
                        >
                            Admin
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-700 hover:text-amber-600 p-2"
                            aria-label="Menu"
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <div className="flex flex-col space-y-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`${isActive(link.href)
                                        ? 'text-amber-600 font-semibold'
                                        : 'text-gray-700 hover:text-amber-600'
                                        } transition py-2`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="/admin"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`${pathname?.startsWith('/admin')
                                    ? 'text-amber-600 font-semibold'
                                    : 'text-gray-700 hover:text-amber-600'
                                    } transition py-2`}
                            >
                                Admin
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
