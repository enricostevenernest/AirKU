'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/app/lib/supabase'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isNight, setIsNight] = useState(false)
    const router = useRouter()

    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                setError(error.message)
                return
            }

            if (data.user) {
                router.push('/admin')
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat login.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            position: 'relative',
            overflow: 'hidden',
            transition: 'background 1.2s ease',
            background: isNight
                ? 'linear-gradient(180deg, #0a0e2e 0%, #0d1b4b 40%, #0a2a4a 70%, #0d3b6e 100%)'
                : 'linear-gradient(180deg, #87ceeb 0%, #b8e4f7 40%, #cfe9f5 70%, #a8d8ea 100%)',
        }}>
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

                /* === WAVES === */
                .wave-parallax > use {
                    animation: wave-move 25s cubic-bezier(.55,.5,.45,.5) infinite;
                }
                .wave-parallax > use:nth-child(1) { animation-delay: -2s; animation-duration: 7s; }
                .wave-parallax > use:nth-child(2) { animation-delay: -3s; animation-duration: 10s; }
                .wave-parallax > use:nth-child(3) { animation-delay: -4s; animation-duration: 13s; }
                .wave-parallax > use:nth-child(4) { animation-delay: -5s; animation-duration: 20s; }
                @keyframes wave-move {
                    0% { transform: translate3d(-90px, 0, 0); }
                    100% { transform: translate3d(85px, 0, 0); }
                }

                /* === PELICAN === */
                .pelican-fly {
                    animation: pelican-soar 18s linear infinite;
                }
                .pelican-wing-top {
                    animation: wing-flap-top 0.6s ease-in-out infinite alternate;
                    transform-origin: right center;
                }
                .pelican-wing-bottom {
                    animation: wing-flap-bottom 0.6s ease-in-out infinite alternate;
                    transform-origin: right center;
                }
                @keyframes pelican-soar {
                    0%   { transform: translate(-120px, 0px); opacity: 0; }
                    5%   { opacity: 1; }
                    50%  { transform: translate(55vw, -60px); opacity: 1; }
                    95%  { opacity: 1; }
                    100% { transform: translate(110vw, -20px); opacity: 0; }
                }
                @keyframes wing-flap-top {
                    0%   { transform: rotate(0deg); }
                    100% { transform: rotate(-25deg); }
                }
                @keyframes wing-flap-bottom {
                    0%   { transform: rotate(0deg); }
                    100% { transform: rotate(20deg); }
                }

                /* === SECOND PELICAN (smaller, delayed) === */
                .pelican-fly-2 {
                    animation: pelican-soar-2 22s linear infinite;
                    animation-delay: 9s;
                    opacity: 0;
                }
                @keyframes pelican-soar-2 {
                    0%   { transform: translate(-80px, 0px); opacity: 0; }
                    5%   { opacity: 0.8; }
                    95%  { opacity: 0.8; }
                    100% { transform: translate(110vw, 40px); opacity: 0; }
                }

                /* === FISH === */
                .fish-1 {
                    animation: jump-fish 12s infinite;
                    animation-delay: 2s;
                    opacity: 0;
                    position: absolute;
                    z-index: 6;
                }
                .fish-2 {
                    animation: jump-fish-reverse 15s infinite;
                    animation-delay: 8s;
                    opacity: 0;
                    position: absolute;
                    z-index: 6;
                }
                
                @keyframes jump-fish {
                    0% { transform: translate3d(0, 100px, 0) rotate(-45deg); opacity: 0; }
                    3% { transform: translate3d(40px, -20px, 0) rotate(-35deg); opacity: 1; }
                    6% { transform: translate3d(80px, -90px, 0) rotate(-20deg); opacity: 1; }
                    10% { transform: translate3d(140px, -140px, 0) rotate(0deg); opacity: 1; }
                    14% { transform: translate3d(200px, -90px, 0) rotate(20deg); opacity: 1; }
                    17% { transform: translate3d(240px, -20px, 0) rotate(35deg); opacity: 1; }
                    20% { transform: translate3d(280px, 100px, 0) rotate(45deg); opacity: 0; }
                    100% { transform: translate3d(280px, 100px, 0) rotate(45deg); opacity: 0; }
                }

                @keyframes jump-fish-reverse {
                    0% { transform: translate3d(0, 100px, 0) rotate(45deg); opacity: 0; }
                    3% { transform: translate3d(-40px, -30px, 0) rotate(35deg); opacity: 1; }
                    6% { transform: translate3d(-80px, -110px, 0) rotate(20deg); opacity: 1; }
                    10% { transform: translate3d(-140px, -170px, 0) rotate(0deg); opacity: 1; }
                    14% { transform: translate3d(-200px, -110px, 0) rotate(-20deg); opacity: 1; }
                    17% { transform: translate3d(-240px, -30px, 0) rotate(-35deg); opacity: 1; }
                    20% { transform: translate3d(-280px, 100px, 0) rotate(-45deg); opacity: 0; }
                    100% { transform: translate3d(-280px, 100px, 0) rotate(-45deg); opacity: 0; }
                }

                /* === SMALL FISH SWIM === */
                .fish-swim {
                    animation: fish-anim 14s linear infinite;
                    animation-delay: 1s;
                    opacity: 0;
                }
                @keyframes fish-anim {
                    0%   { transform: translate(0, 0); opacity: 0; }
                    5%   { opacity: 1; }
                    50%  { transform: translate(90px, -20px); opacity: 1; }
                    95%  { opacity: 1; }
                    100% { transform: translate(210px, -5px); opacity: 0; }
                }

                /* === STARS (Night only) === */
                .stars-container {
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 60%;
                    pointer-events: none;
                    z-index: 1;
                }
                .star {
                    position: absolute;
                    background: white;
                    border-radius: 50%;
                    animation: twinkle 3s ease-in-out infinite alternate;
                }
                @keyframes twinkle {
                    0%   { opacity: 0.2; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1.2); }
                }

                /* === SUN/MOON TOGGLE === */
                .sky-toggle {
                    position: absolute;
                    top: 24px;
                    right: 28px;
                    z-index: 50;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
                }
                .sky-toggle:hover { transform: scale(1.15) rotate(15deg); }

                /* === BUBBLES === */
                .bubble {
                    position: absolute;
                    border-radius: 50%;
                    opacity: 0.15;
                    animation: bubble-rise 8s ease-in infinite;
                }
                @keyframes bubble-rise {
                    0%   { transform: translateY(0) scale(1); opacity: 0.15; }
                    100% { transform: translateY(-100vh) scale(1.3); opacity: 0; }
                }

                /* === CLOUDS (Day only) === */
                .cloud {
                    position: absolute;
                    opacity: 0.7;
                    animation: cloud-drift 30s linear infinite;
                }
                .cloud-2 { animation-duration: 45s; animation-delay: -15s; opacity: 0.5; }
                @keyframes cloud-drift {
                    0%   { transform: translateX(-300px); }
                    100% { transform: translateX(110vw); }
                }

                /* === CARD GLOW === */
                .login-card {
                    background: rgba(255,255,255,0.92);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255,255,255,0.6);
                    border-radius: 20px;
                    box-shadow: 0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
                    padding: 40px 36px;
                    width: 100%;
                    max-width: 420px;
                    margin: 0 16px;
                    position: relative;
                    z-index: 30;
                    transition: box-shadow 0.4s ease;
                }
                .login-card:hover {
                    box-shadow: 0 12px 50px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08);
                }
                .night-card {
                    background: rgba(10, 30, 70, 0.88) !important;
                    border: 1px solid rgba(100, 160, 255, 0.25) !important;
                    box-shadow: 0 8px 40px rgba(0, 100, 255, 0.15), 0 0 80px rgba(0, 60, 180, 0.08) !important;
                }

                /* === INPUT === */
                .login-input {
                    width: 100%;
                    padding: 13px 16px;
                    border: 1.5px solid #cbe0ec;
                    border-radius: 12px;
                    background: rgba(248, 251, 254, 0.9);
                    font-size: 0.9rem;
                    color: #333;
                    outline: none;
                    transition: all 0.2s ease;
                    box-sizing: border-box;
                }
                .login-input:focus {
                    border-color: #2a8cb9;
                    box-shadow: 0 0 0 3px rgba(42, 140, 185, 0.12);
                    background: #fff;
                }
                .night-input {
                    background: rgba(255,255,255,0.08) !important;
                    border-color: rgba(100, 180, 255, 0.3) !important;
                    color: #e0f0ff !important;
                }
                .night-input:focus {
                    border-color: rgba(100, 200, 255, 0.7) !important;
                    box-shadow: 0 0 0 3px rgba(100, 180, 255, 0.15) !important;
                }
                .night-input::placeholder { color: rgba(180,210,255,0.5) !important; }

                /* === BUTTON === */
                .login-btn {
                    width: 100%;
                    padding: 14px;
                    border: none;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #1a516b, #2a8cb9);
                    color: white;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    box-shadow: 0 4px 15px rgba(26, 81, 107, 0.35);
                    letter-spacing: 0.3px;
                }
                .login-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 22px rgba(26, 81, 107, 0.45);
                    background: linear-gradient(135deg, #133d52, #1a6e96);
                }
                .login-btn:active:not(:disabled) { transform: translateY(0); }
                .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                .night-btn {
                    background: linear-gradient(135deg, #1a3a6b, #2a5cb9) !important;
                    box-shadow: 0 4px 15px rgba(30, 80, 200, 0.4) !important;
                }

                /* === LABEL === */
                .login-label {
                    display: block;
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: #444;
                    margin-bottom: 6px;
                    margin-left: 2px;
                }
                .night-label { color: rgba(180,220,255,0.85) !important; }

                /* === SPINNER === */
                @keyframes spin { to { transform: rotate(360deg); } }
                .spinner { animation: spin 0.8s linear infinite; }

                /* === BACK BUTTON === */
                .back-btn {
                    position: absolute;
                    top: 24px;
                    left: 28px;
                    z-index: 50;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 18px;
                    background: rgba(255,255,255,0.35);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    border-radius: 30px;
                    color: #1a516b;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.9rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    transition: all 0.3s ease;
                    border: 1px solid rgba(255,255,255,0.5);
                }
                .back-btn:hover {
                    transform: translateX(-4px);
                    background: rgba(255,255,255,0.6);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.1);
                }
                .night-back-btn {
                    background: rgba(255,255,255,0.1) !important;
                    color: #e0f0ff !important;
                    border-color: rgba(255,255,255,0.15) !important;
                }
                .night-back-btn:hover {
                    background: rgba(255,255,255,0.2) !important;
                }
            `}} />

            {/* ====== BACK TO DASHBOARD ====== */}
            <Link href="/" className={`back-btn ${isNight ? 'night-back-btn' : ''}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Kembali
            </Link>

            {/* ====== SUN / MOON TOGGLE ====== */}
            <div className="sky-toggle" onClick={() => setIsNight(!isNight)} title={isNight ? 'Beralih ke Mode Siang' : 'Beralih ke Mode Malam'}>
                {isNight ? (
                    /* Moon */
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="22" cy="22" r="22" fill="rgba(20,30,80,0.4)" />
                        <path d="M28 10C21 10 15 16 15 23C15 30 21 36 28 36C25 36 18 33 18 23C18 13 25 10 28 10Z" fill="#e8e0ff" />
                        <circle cx="24" cy="16" r="1.5" fill="rgba(200,180,255,0.5)" />
                        <circle cx="20" cy="28" r="1" fill="rgba(200,180,255,0.4)" />
                        <circle cx="28" cy="25" r="2" fill="rgba(200,180,255,0.3)" />
                        {/* Stars around moon */}
                        <path d="M8 8 L9 5 L10 8 L13 9 L10 10 L9 13 L8 10 L5 9 Z" fill="white" opacity="0.9"/>
                        <path d="M35 6 L36 4 L37 6 L39 7 L37 8 L36 10 L35 8 L33 7 Z" fill="white" opacity="0.7"/>
                        <circle cx="38" cy="16" r="1.2" fill="white" opacity="0.8"/>
                        <circle cx="6" cy="18" r="1" fill="white" opacity="0.7"/>
                    </svg>
                ) : (
                    /* Sun */
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="22" cy="22" r="22" fill="rgba(255,220,0,0.15)" />
                        <circle cx="22" cy="22" r="10" fill="#FFD700" />
                        <circle cx="22" cy="22" r="7" fill="#FFA500" opacity="0.6"/>
                        {[0,45,90,135,180,225,270,315].map((deg, i) => (
                            <line key={i}
                                x1={22 + 12 * Math.cos(deg * Math.PI / 180)}
                                y1={22 + 12 * Math.sin(deg * Math.PI / 180)}
                                x2={22 + 17 * Math.cos(deg * Math.PI / 180)}
                                y2={22 + 17 * Math.sin(deg * Math.PI / 180)}
                                stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round"
                            />
                        ))}
                    </svg>
                )}
            </div>

            {/* ====== STARS (Night Mode) ====== */}
            {isNight && (
                <div className="stars-container">
                    {Array.from({ length: 60 }).map((_, i) => (
                        <div key={i} className="star" style={{
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 4}s`,
                            animationDuration: `${Math.random() * 3 + 2}s`,
                        }} />
                    ))}
                </div>
            )}

            {/* ====== CLOUDS (Day Mode) ====== */}
            {!isNight && (
                <>
                    <div className="cloud" style={{ top: '8%', left: '-100px' }}>
                        <svg width="180" height="60" viewBox="0 0 180 60" fill="white">
                            <ellipse cx="90" cy="40" rx="80" ry="20" />
                            <ellipse cx="70" cy="30" rx="45" ry="22" />
                            <ellipse cx="110" cy="28" rx="38" ry="20" />
                        </svg>
                    </div>
                    <div className="cloud cloud-2" style={{ top: '15%', left: '-200px' }}>
                        <svg width="130" height="45" viewBox="0 0 130 45" fill="rgba(255,255,255,0.8)">
                            <ellipse cx="65" cy="30" rx="55" ry="16" />
                            <ellipse cx="50" cy="22" rx="30" ry="16" />
                            <ellipse cx="80" cy="20" rx="28" ry="15" />
                        </svg>
                    </div>
                </>
            )}

            {/* ====== PELICAN 1 (Main) - distant bird silhouette ====== */}
            <div className="pelican-fly" style={{ position: 'absolute', top: '18%', left: 0, zIndex: 5 }}>
                {/* Distant flying bird: wide V-shaped wings + small oval body + long beak */}
                <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Left wing - curves upward at tip like soaring bird */}
                    <path d="M48 20 C38 16 22 10 8 14 C4 15 0 18 2 20 C16 16 34 17 48 22Z"
                        fill={isNight ? '#c8d8f0' : '#e8e0d0'} />
                    {/* Right wing */}
                    <path d="M52 20 C62 16 78 10 92 14 C96 15 100 18 98 20 C84 16 66 17 52 22Z"
                        fill={isNight ? '#c8d8f0' : '#e8e0d0'} />
                    {/* Body */}
                    <ellipse cx="50" cy="22" rx="8" ry="4" fill={isNight ? '#dce8f8' : '#f0ece0'} />
                    {/* Head */}
                    <circle cx="58" cy="19" r="4.5" fill={isNight ? '#dce8f8' : '#f5f0e5'} />
                    {/* Long beak (pelican distinctive) */}
                    <path d="M61 18 L78 20 C78 21.5 76 22 74 21.5 L61 20Z" fill="#d4900a" />
                    {/* Beak pouch */}
                    <path d="M63 20 Q70 25 66 25 L63 20Z" fill="#e8a820" opacity="0.85" />
                    {/* Eye */}
                    <circle cx="60" cy="18" r="1.5" fill={isNight ? '#1a2a4a' : '#1a3a5a'} />
                    <circle cx="60.4" cy="17.6" r="0.5" fill="white" />
                    {/* Tail feathers */}
                    <path d="M42 22 L32 20 L34 23 L30 24 L34 26 L42 24Z"
                        fill={isNight ? '#b0c4de' : '#d8d0c0'} />
                    {/* Wing tip feather detail */}
                    <path d="M4 19 L0 16 L1 20 L0 23Z" fill={isNight ? '#a0b8d8' : '#c8c0b0'} />
                    <path d="M96 19 L100 16 L99 20 L100 23Z" fill={isNight ? '#a0b8d8' : '#c8c0b0'} />
                </svg>
            </div>

            {/* ====== PELICAN 2 (Smaller, farther away) ====== */}
            <div className="pelican-fly-2" style={{ position: 'absolute', top: '30%', left: 0, zIndex: 5 }}>
                {/* Even smaller/simpler silhouette = looks further away */}
                <svg width="60" height="24" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M48 20 C38 16 22 10 8 14 C4 15 0 18 2 20 C16 16 34 17 48 22Z"
                        fill={isNight ? '#b0c8e8' : '#ddd5c5'} opacity="0.85" />
                    <path d="M52 20 C62 16 78 10 92 14 C96 15 100 18 98 20 C84 16 66 17 52 22Z"
                        fill={isNight ? '#b0c8e8' : '#ddd5c5'} opacity="0.85" />
                    <ellipse cx="50" cy="21" rx="7" ry="3.5" fill={isNight ? '#c8daf0' : '#eae4d4'} />
                    <circle cx="57" cy="19" r="4" fill={isNight ? '#c8daf0' : '#eee8d8'} />
                    <path d="M60 18 L74 20 L60 20Z" fill="#d4900a" />
                    <circle cx="58.5" cy="18" r="1.2" fill={isNight ? '#1a2a4a' : '#1a3a5a'} />
                </svg>
            </div>

            {/* ====== JUMPING FISH 1 (Left to Right) ====== */}
            <div className="fish-1" style={{ bottom: '20px', left: '15%', width: '4rem', height: '2rem', color: isNight ? '#4a90e2' : '#5aa8c8' }}>
                <svg viewBox="0 0 100 50" fill="currentColor" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07))' }}>
                    <path d="M 20 25 C 20 10 50 0 70 10 C 90 20 100 25 100 25 C 100 25 90 30 70 40 C 50 50 20 40 20 25 Z" />
                    <path d="M 20 25 L 0 10 L 5 25 L 0 40 Z" />
                    <circle cx="75" cy="20" r="3" fill="#fff" />
                </svg>
            </div>

            {/* ====== JUMPING FISH 2 (Right to Left) ====== */}
            <div className="fish-2" style={{ bottom: '40px', right: '20%', width: '3rem', height: '1.5rem', color: isNight ? '#2a648e' : '#1a516b' }}>
                <svg viewBox="0 0 100 50" fill="currentColor" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07))' }}>
                    <path d="M 80 25 C 80 10 50 0 30 10 C 10 20 0 25 0 25 C 0 25 10 30 30 40 C 50 50 80 40 80 25 Z" />
                    <path d="M 80 25 L 100 10 L 95 25 L 100 40 Z" />
                    <circle cx="25" cy="20" r="3" fill="#fff" />
                </svg>
            </div>

            {/* ====== SMALL FISH ====== */}
            <div className="fish-swim" style={{ position: 'absolute', bottom: '22%', left: '5%', zIndex: 4 }}>
                <svg width="40" height="22" viewBox="0 0 100 50" fill={isNight ? '#4a90c0' : '#5aaad8'}>
                    <path d="M20 25 C20 10 50 0 70 10 C90 20 100 25 100 25 C100 25 90 30 70 40 C50 50 20 40 20 25Z" />
                    <path d="M20 25 L0 10 L5 25 L0 40Z" />
                    <circle cx="75" cy="20" r="3" fill="white" />
                </svg>
            </div>

            {/* ====== BUBBLES ====== */}
            {[...Array(8)].map((_, i) => (
                <div key={i} className="bubble" style={{
                    width: `${8 + i * 5}px`,
                    height: `${8 + i * 5}px`,
                    bottom: '-20px',
                    left: `${10 + i * 12}%`,
                    background: isNight ? '#4a90e0' : '#88ccee',
                    animationDelay: `${i * 1.2}s`,
                    animationDuration: `${6 + i * 1.5}s`,
                }} />
            ))}

            {/* ====== ANIMATED WAVES ====== */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', lineHeight: 0, zIndex: 10 }}>
                <svg style={{ display: 'block', width: '100%', height: '140px' }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 24 150 28"
                    preserveAspectRatio="none">
                    <defs>
                        <path id="ocean-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                    </defs>
                    <g className="wave-parallax">
                        {isNight ? (
                            <>
                                <use href="#ocean-wave" x="48" y="0" fill="rgba(20, 50, 120, 0.7)" />
                                <use href="#ocean-wave" x="48" y="3" fill="rgba(10, 30, 90, 0.5)" />
                                <use href="#ocean-wave" x="48" y="5" fill="rgba(15, 40, 110, 0.6)" />
                                <use href="#ocean-wave" x="48" y="7" fill="rgba(8, 20, 70, 0.95)" />
                            </>
                        ) : (
                            <>
                                <use href="#ocean-wave" x="48" y="0" fill="rgba(167, 221, 251, 0.7)" />
                                <use href="#ocean-wave" x="48" y="3" fill="rgba(255, 255, 255, 0.4)" />
                                <use href="#ocean-wave" x="48" y="5" fill="rgba(142, 206, 244, 0.5)" />
                                <use href="#ocean-wave" x="48" y="7" fill="#8ecef4" />
                            </>
                        )}
                    </g>
                </svg>
            </div>

            {/* ====== LOGIN CARD ====== */}
            <div className={`login-card ${isNight ? 'night-card' : ''}`}>
                {/* Logo / Icon */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                        width: '64px', height: '64px',
                        borderRadius: '50%',
                        background: isNight
                            ? 'linear-gradient(135deg, #1a3a6b, #2a5cb9)'
                            : 'linear-gradient(135deg, #1a516b, #2a8cb9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px',
                        boxShadow: isNight
                            ? '0 4px 20px rgba(50, 100, 220, 0.4)'
                            : '0 4px 20px rgba(26, 81, 107, 0.3)',
                    }}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z" fill="rgba(255,255,255,0.15)"/>
                            <path d="M16 8a4 4 0 100 8 4 4 0 000-8z" fill="white"/>
                            <path d="M8 24c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <h1 style={{
                        fontSize: '1.65rem', fontWeight: 700,
                        color: isNight ? '#e0f0ff' : '#1a516b',
                        margin: '0 0 6px', letterSpacing: '-0.3px',
                    }}>Admin Login</h1>
                    <p style={{
                        fontSize: '0.83rem',
                        color: isNight ? 'rgba(160,200,255,0.7)' : '#888',
                        margin: 0,
                    }}>Sistem Pengelolaan Airku</p>
                </div>

                {error && (
                    <div style={{
                        marginBottom: '20px', padding: '12px 16px',
                        fontSize: '0.83rem',
                        color: '#c62828',
                        background: '#fde8e8',
                        border: '1px solid #ef9a9a',
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                        <span style={{ fontSize: '1.1rem' }}>⚠️</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                        <label className={`login-label ${isNight ? 'night-label' : ''}`}>
                            Email Admin
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`login-input ${isNight ? 'night-input' : ''}`}
                            placeholder="admin@airku.id"
                        />
                    </div>

                    <div>
                        <label className={`login-label ${isNight ? 'night-label' : ''}`}>
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`login-input ${isNight ? 'night-input' : ''}`}
                            placeholder="••••••••"
                        />
                    </div>

                    <div style={{ paddingTop: '6px' }}>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`login-btn ${isNight ? 'night-btn' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                                        <path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
                                    </svg>
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                        <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                                    </svg>
                                    Masuk Dashboard
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <p style={{
                    textAlign: 'center', marginTop: '20px', marginBottom: 0,
                    fontSize: '0.72rem',
                    color: isNight ? 'rgba(120,170,230,0.5)' : 'rgba(150,150,150,0.6)',
                }}>
                    🔒 Akses terbatas untuk administrator
                </p>
            </div>
        </div>
    )
}
// Linked to SCRUM-160 & SCRUM-162
