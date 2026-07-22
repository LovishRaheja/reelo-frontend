'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/useUser'

export default function Nav() {
    const router = useRouter()
    const { user } = useUser()
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    async function signOut() {
        await supabase.auth.signOut()
        router.push('/')
        setOpen(false)
    }

    return (
        <nav style={{
            padding: '16px 48px',
            borderBottom: '1px solid #1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
            <span>
            <img
                src="/logo.svg"
                height={35}
                alt="Reelo"
                style={{ cursor: 'pointer', display: 'block' }}
                onClick={() => router.push('/')}
            />
            </span>

            {user ? (
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                    {/* Profile trigger */}
                    <div
                        onClick={() => setOpen(!open)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            cursor: 'pointer', padding: '6px 10px',
                            borderRadius: '8px', border: '1px solid transparent',
                            transition: 'border-color 0.15s',
                            borderColor: open ? '#2a2a2a' : 'transparent',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#2a2a2a'}
                        onMouseLeave={e => { if (!open) e.currentTarget.style.borderColor = 'transparent' }}
                    >
                        {/* Avatar */}
                        <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: '#7c3aed', overflow: 'hidden', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '12px', fontWeight: 600, color: '#fff',
                        }}>
                            {user.user_metadata?.avatar_url ? (
                                <img
                                    src={user.user_metadata.avatar_url}
                                    width={28} height={28}
                                    style={{ borderRadius: '50%', display: 'block' }}
                                    alt="avatar"
                                />
                            ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            )}
                        </div>
                        {/* Name */}
                        <span style={{ fontSize: '13px', color: '#888' }}>
                            {user.user_metadata?.full_name?.split(' ')[0] ?? user.email?.split('@')[0]}
                        </span>
                        {/* Chevron */}
                        <svg
                            width="12" height="12" viewBox="0 0 24 24" fill="none"
                            stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{ transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>

                    {/* Dropdown */}
                    {open && (
                        <div style={{
                            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                            background: '#111', border: '1px solid #222',
                            borderRadius: '10px', overflow: 'hidden',
                            minWidth: '160px', zIndex: 100,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                        }}>
                            <button
                                onClick={() => { router.push('/reels'); setOpen(false) }}
                                style={{
                                    width: '100%', padding: '11px 16px',
                                    background: 'transparent', border: 'none',
                                    textAlign: 'left', fontSize: '13px', color: '#ccc',
                                    cursor: 'pointer', fontFamily: 'inherit',
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    transition: 'background 0.1s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                                    <line x1="7" y1="2" x2="7" y2="22" />
                                    <line x1="17" y1="2" x2="17" y2="22" />
                                    <line x1="2" y1="12" x2="22" y2="12" />
                                    <line x1="2" y1="7" x2="7" y2="7" />
                                    <line x1="2" y1="17" x2="7" y2="17" />
                                    <line x1="17" y1="17" x2="22" y2="17" />
                                    <line x1="17" y1="7" x2="22" y2="7" />
                                </svg>
                                My Reels
                            </button>

                            <div style={{ height: '1px', background: '#1a1a1a' }} />

                            <button
                                onClick={signOut}
                                style={{
                                    width: '100%', padding: '11px 16px',
                                    background: 'transparent', border: 'none',
                                    textAlign: 'left', fontSize: '13px', color: '#666',
                                    cursor: 'pointer', fontFamily: 'inherit',
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    transition: 'background 0.1s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <a href="/auth" style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>
                    Sign in
                </a>
            )}
        </nav>
    )
}
