'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase'

export default function ProfilePage() {
    const supabase = createClient()

    const [activeTab, setActiveTab] = useState<'email' | 'password'>('email')

    const [currentEmail, setCurrentEmail] = useState<string>('')
    const [newEmail, setNewEmail] = useState('')
    
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [isEmailLoading, setIsEmailLoading] = useState(false)
    const [isPasswordLoading, setIsPasswordLoading] = useState(false)

    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.email) {
                setCurrentEmail(user.email)
            }
        }
        fetchUser()
    }, [supabase.auth])

    // Auto-hilangkan notifikasi setelah 6 detik
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 6000)
            return () => clearTimeout(timer)
        }
    }, [message])

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newEmail) return
        
        setIsEmailLoading(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.updateUser({ email: newEmail })

            if (error) {
                setMessage({ type: 'error', text: error.message })
            } else {
                setMessage({ type: 'success', text: 'Alamat email berhasil diperbarui secara langsung!' })
                setNewEmail('')
                const { data } = await supabase.auth.getUser()
                if (data.user?.email) setCurrentEmail(data.user.email)
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan sistem.' })
        } finally {
            setIsEmailLoading(false)
        }
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newPassword || !confirmPassword) return
        
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok dengan password baru.' })
            return
        }
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password harus memiliki minimal 6 karakter.' })
            return
        }

        setIsPasswordLoading(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword })

            if (error) {
                setMessage({ type: 'error', text: error.message })
            } else {
                setMessage({ type: 'success', text: 'Password berhasil diperbarui!' })
                setNewPassword('')
                setConfirmPassword('')
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan sistem.' })
        } finally {
            setIsPasswordLoading(false)
        }
    }

    return (
        <div className="profile-page-water">
            {/* Floating Bubbles Background */}
            <div className="water-bubbles-container" aria-hidden="true">
                <div className="water-bubble bubble-1"></div>
                <div className="water-bubble bubble-2"></div>
                <div className="water-bubble bubble-3"></div>
                <div className="water-bubble bubble-4"></div>
            </div>

            {/* Header Section with Water Ripple */}
            <div className="profile-water-header">
                <div className="water-ripple-bg" aria-hidden="true">
                    <div className="ripple ripple-1"></div>
                    <div className="ripple ripple-2"></div>
                    <div className="ripple ripple-3"></div>
                </div>
                <div className="header-content">
                    <div className="header-icon-wrap">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                        </svg>
                    </div>
                    <div>
                        <h1 className="profile-title">Pengaturan Akun</h1>
                        <p className="profile-subtitle">Kelola keamanan akun administrator Anda</p>
                    </div>
                </div>
                {/* Animated Wave Separator */}
                <div className="animated-waves">
                    <svg className="wave-layer wave-layer-1" viewBox="0 0 2400 60" preserveAspectRatio="none">
                        <path d="M0,30 C200,50 400,10 600,30 C800,50 1000,10 1200,30 C1400,50 1600,10 1800,30 C2000,50 2200,10 2400,30 L2400,60 L0,60 Z" fill="rgba(234,244,249,0.6)"/>
                    </svg>
                    <svg className="wave-layer wave-layer-2" viewBox="0 0 2400 60" preserveAspectRatio="none">
                        <path d="M0,40 C200,20 400,60 600,40 C800,20 1000,60 1200,40 C1400,20 1600,60 1800,40 C2000,20 2200,60 2400,40 L2400,60 L0,60 Z" fill="rgba(234,244,249,1)"/>
                    </svg>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="profile-tab-nav">
                <button 
                    type="button"
                    onClick={() => { setActiveTab('email'); setMessage(null); }}
                    className={`profile-tab-btn ${activeTab === 'email' ? 'active' : ''}`}
                    id="tab-email"
                >
                    <span className="tab-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2"/>
                            <path d="M22 4l-10 8L2 4"/>
                        </svg>
                    </span>
                    <span className="tab-label">Ganti Email</span>
                    {activeTab === 'email' && <span className="tab-active-wave"></span>}
                </button>
                <button 
                    type="button"
                    onClick={() => { setActiveTab('password'); setMessage(null); }}
                    className={`profile-tab-btn ${activeTab === 'password' ? 'active' : ''}`}
                    id="tab-password"
                >
                    <span className="tab-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                    </span>
                    <span className="tab-label">Ganti Password</span>
                    {activeTab === 'password' && <span className="tab-active-wave"></span>}
                </button>
            </div>

            {/* Main Card */}
            <div className="profile-glass-card">
                {/* Decorative water corner */}
                <div className="card-water-corner" aria-hidden="true">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                        <circle cx="100" cy="20" r="60" fill="rgba(43,144,191,0.04)"/>
                        <circle cx="110" cy="10" r="30" fill="rgba(43,144,191,0.06)"/>
                    </svg>
                </div>

                {activeTab === 'email' && (
                    <div className="tab-content-animated" key="email">
                        <div className="card-section-header">
                            <div className="section-icon-circle email-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                                    <path d="M22 4l-10 8L2 4"/>
                                </svg>
                            </div>
                            <div>
                                <h2 className="section-title-text">Perbarui Alamat Email</h2>
                                <p className="section-desc">Ubah email yang terhubung dengan akun admin</p>
                            </div>
                        </div>

                        <div className="info-banner water-info">
                            <div className="info-icon-wrap">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="16" x2="12" y2="12"/>
                                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                                </svg>
                            </div>
                            <p>Sistem akan langsung memperbarui alamat email Anda secara permanen. Pastikan email baru yang Anda masukkan sudah benar.</p>
                        </div>

                        {message && (
                            <div className={`notification-bar ${message.type === 'error' ? 'notif-error' : 'notif-success'}`}>
                                <span className="notif-icon">{message.type === 'error' ? '✕' : '✓'}</span>
                                <span>{message.text}</span>
                            </div>
                        )}

                        <form onSubmit={handleUpdateEmail} className="profile-form">
                            <div className="form-field">
                                <label className="field-label">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                    Email Saat Ini
                                </label>
                                <div className="input-wrapper disabled">
                                    <input
                                        type="text"
                                        disabled
                                        value={currentEmail || 'Memuat...'}
                                        className="water-input disabled"
                                        id="current-email"
                                    />
                                    <span className="input-lock-icon">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2"/>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div className="form-field">
                                <label className="field-label">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                                        <path d="M22 4l-10 8L2 4"/>
                                    </svg>
                                    Email Baru
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type="email"
                                        required
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        className="water-input"
                                        placeholder="admin@example.com"
                                        id="new-email"
                                    />
                                    <span className="input-water-accent"></span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isEmailLoading || !newEmail}
                                className="water-submit-btn"
                                id="submit-email"
                            >
                                <span className="btn-ripple"></span>
                                {isEmailLoading ? (
                                    <span className="loading-spinner"></span>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 2L11 13"/>
                                        <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                                    </svg>
                                )}
                                {isEmailLoading ? 'Memproses...' : 'Perbarui Email'}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'password' && (
                    <div className="tab-content-animated" key="password">
                        <div className="card-section-header">
                            <div className="section-icon-circle password-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </div>
                            <div>
                                <h2 className="section-title-text">Perbarui Password</h2>
                                <p className="section-desc">Amankan akun Anda dengan password yang kuat</p>
                            </div>
                        </div>

                        <div className="info-banner water-info">
                            <div className="info-icon-wrap">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                            </div>
                            <p>Sistem akan langsung memperbarui password Anda. Pastikan Anda mengingat password baru Anda untuk akses login selanjutnya.</p>
                        </div>

                        {message && (
                            <div className={`notification-bar ${message.type === 'error' ? 'notif-error' : 'notif-success'}`}>
                                <span className="notif-icon">{message.type === 'error' ? '✕' : '✓'}</span>
                                <span>{message.text}</span>
                            </div>
                        )}

                        <form onSubmit={handleUpdatePassword} className="profile-form">
                            <div className="form-field">
                                <label className="field-label">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                    Password Baru
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="water-input"
                                        placeholder="Minimal 6 karakter"
                                        minLength={6}
                                        id="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="toggle-password-btn"
                                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                    >
                                        {showPassword ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </button>
                                    <span className="input-water-accent"></span>
                                </div>
                                {newPassword && (
                                    <div className="password-strength">
                                        <div className="strength-bar">
                                            <div 
                                                className={`strength-fill ${
                                                    newPassword.length >= 12 ? 'strong' : 
                                                    newPassword.length >= 8 ? 'medium' : 'weak'
                                                }`}
                                                style={{ width: `${Math.min(100, (newPassword.length / 12) * 100)}%` }}
                                            ></div>
                                        </div>
                                        <span className={`strength-label ${
                                            newPassword.length >= 12 ? 'strong' : 
                                            newPassword.length >= 8 ? 'medium' : 'weak'
                                        }`}>
                                            {newPassword.length >= 12 ? '💧 Kuat' : 
                                             newPassword.length >= 8 ? '🌊 Sedang' : '💦 Lemah'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="form-field">
                                <label className="field-label">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                    Konfirmasi Password
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`water-input ${confirmPassword && newPassword !== confirmPassword ? 'input-mismatch' : ''} ${confirmPassword && newPassword === confirmPassword ? 'input-match' : ''}`}
                                        placeholder="Ketik ulang password baru"
                                        minLength={6}
                                        id="confirm-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="toggle-password-btn"
                                        aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                                    >
                                        {showConfirmPassword ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </button>
                                    <span className="input-water-accent"></span>
                                </div>
                                {confirmPassword && newPassword === confirmPassword && (
                                    <span className="match-indicator">✓ Password cocok</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isPasswordLoading || !newPassword || !confirmPassword}
                                className="water-submit-btn"
                                id="submit-password"
                            >
                                <span className="btn-ripple"></span>
                                {isPasswordLoading ? (
                                    <span className="loading-spinner"></span>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                )}
                                {isPasswordLoading ? 'Memproses...' : 'Perbarui Password'}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Footer Decoration */}
            <div className="profile-water-footer" aria-hidden="true">
                <svg width="100%" height="40" viewBox="0 0 1200 40" preserveAspectRatio="none">
                    <path d="M0,20 Q300,40 600,20 Q900,0 1200,20 L1200,40 L0,40 Z" fill="rgba(43,144,191,0.06)"/>
                </svg>
            </div>

            <style>{`
                /* ===== PROFILE PAGE — WATER THEME ===== */

                .profile-page-water {
                    position: relative;
                    max-width: 100%;
                    width: 100%;
                    margin: 0 auto;
                    padding: 0 0 40px 0;
                    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
                    overflow: hidden;
                }

                /* ---- Floating Bubbles ---- */
                .water-bubbles-container {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 0;
                    overflow: hidden;
                }

                .water-bubble {
                    position: absolute;
                    border-radius: 50%;
                    background: radial-gradient(circle at 30% 30%, rgba(43,144,191,0.07), rgba(43,144,191,0.02));
                    border: 1px solid rgba(43,144,191,0.05);
                    animation: floatBubble 10s ease-in-out infinite;
                }

                .bubble-1 { width: 40px; height: 40px; left: 8%; top: 25%; animation-delay: 0s; animation-duration: 12s; }
                .bubble-2 { width: 24px; height: 24px; left: 80%; top: 18%; animation-delay: 2s; animation-duration: 10s; }
                .bubble-3 { width: 30px; height: 30px; left: 65%; top: 55%; animation-delay: 4s; animation-duration: 14s; }
                .bubble-4 { width: 18px; height: 18px; left: 20%; top: 68%; animation-delay: 1s; animation-duration: 11s; }

                @keyframes floatBubble {
                    0%, 100% { transform: translateY(0) scale(1); opacity: 0.35; }
                    25% { transform: translateY(-10px) scale(1.03); opacity: 0.5; }
                    50% { transform: translateY(-18px) scale(0.97); opacity: 0.3; }
                    75% { transform: translateY(-8px) scale(1.01); opacity: 0.4; }
                }

                /* ---- Water Header ---- */
                .profile-water-header {
                    position: relative;
                    background: #2a8cb9;

                    border-radius: 24px;
                    padding: 40px 40px 60px;
                    margin: 0 0 24px 0;
                    overflow: hidden;
                    z-index: 1;
                    box-shadow: 0 10px 30px rgba(43,144,191,0.15);
                }

                .water-ripple-bg {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                }

                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    border: 2px solid rgba(255,255,255,0.1);
                    animation: rippleExpand 4s ease-out infinite;
                }

                .ripple-1 { width: 140px; height: 140px; top: -30px; right: -20px; animation-delay: 0s; }
                .ripple-2 { width: 100px; height: 100px; top: 10px; right: 30px; animation-delay: 1.3s; }
                .ripple-3 { width: 70px; height: 70px; top: -10px; right: 60px; animation-delay: 2.6s; }

                @keyframes rippleExpand {
                    0% { transform: scale(0.5); opacity: 0.6; }
                    100% { transform: scale(2.5); opacity: 0; }
                }

                .header-content {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .header-icon-wrap {
                    position: relative;
                    width: 56px;
                    height: 56px;
                    background: rgba(255,255,255,0.15);
                    backdrop-filter: blur(8px);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    border: 1px solid rgba(255,255,255,0.2);
                    flex-shrink: 0;
                }

                .water-drop-icon {
                    position: absolute;
                    bottom: -4px;
                    right: -4px;
                    color: rgba(255,255,255,0.7);
                    animation: waterDrop 3s ease-in-out infinite;
                }

                @keyframes waterDrop {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(3px); }
                }

                .profile-title {
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: #ffffff;
                    margin: 0;
                    letter-spacing: -0.01em;
                    text-shadow: 0 2px 8px rgba(0,0,0,0.15);
                }

                .profile-subtitle {
                    font-size: 0.9rem;
                    color: rgba(255,255,255,0.85);
                    margin: 4px 0 0;
                    font-weight: 400;
                }

                .animated-waves {
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    width: 100%;
                    height: 36px;
                    overflow: hidden;
                }
                
                .wave-layer {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 200%;
                    height: 100%;
                }
                
                .wave-layer-1 {
                    animation: wave-move 16s linear infinite;
                }
                
                .wave-layer-2 {
                    animation: wave-move 10s linear infinite reverse;
                }
                
                @keyframes wave-move {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                /* ---- Tab Navigation ---- */
                .profile-tab-nav {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    gap: 16px;
                    margin: -10px 0 24px;
                    padding: 0;
                    max-width: 800px;
                }

                .profile-tab-btn {
                    position: relative;
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 16px 20px;
                    border: none;
                    border-radius: 16px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: inherit;
                    overflow: hidden;
                    background: rgba(255,255,255,0.75);
                    backdrop-filter: blur(8px);
                    color: #6a9aac;
                    border: 1px solid rgba(43,144,191,0.1);
                    box-shadow: 0 1px 4px rgba(0,0,0,0.03);
                }

                .profile-tab-btn:hover {
                    background: rgba(255,255,255,0.9);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 16px rgba(43,144,191,0.12);
                }

                .profile-tab-btn.active {
                    background: linear-gradient(135deg, #1e7399, #3194b8);
                    color: #ffffff;
                    border-color: transparent;
                    box-shadow: 0 3px 12px rgba(43,144,191,0.25);
                    transform: translateY(-1px);
                }

                .tab-icon {
                    display: flex;
                    align-items: center;
                }

                .tab-label {
                    position: relative;
                    z-index: 1;
                }

                .tab-active-wave {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: rgba(255,255,255,0.4);
                    border-radius: 3px 3px 0 0;
                    animation: waveTab 2s ease-in-out infinite;
                }

                @keyframes waveTab {
                    0%, 100% { transform: scaleX(0.8); opacity: 0.6; }
                    50% { transform: scaleX(1); opacity: 1; }
                }

                /* ---- Glass Card ---- */
                .profile-glass-card {
                    position: relative;
                    z-index: 1;
                    background: rgba(255,255,255,0.88);
                    backdrop-filter: blur(16px);
                    border-radius: 24px;
                    padding: 40px;
                    border: 1px solid rgba(43,144,191,0.08);
                    box-shadow: 
                        0 4px 24px rgba(43,144,191,0.08),
                        0 1px 4px rgba(0,0,0,0.04),
                        inset 0 1px 0 rgba(255,255,255,0.7);
                    overflow: hidden;
                }

                .card-water-corner {
                    position: absolute;
                    top: 0;
                    right: 0;
                    pointer-events: none;
                    opacity: 0.8;
                }

                /* ---- Section Header ---- */
                .card-section-header {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    margin-bottom: 16px;
                }

                .section-icon-circle {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .section-icon-circle.email-icon {
                    background: linear-gradient(135deg, rgba(43,144,191,0.12), rgba(72,181,212,0.18));
                    color: #2b90bf;
                }

                .section-icon-circle.password-icon {
                    background: linear-gradient(135deg, rgba(26,107,138,0.12), rgba(43,144,191,0.18));
                    color: #1a6b8a;
                }

                .section-title-text {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #1e5f78;
                    margin: 0;
                    letter-spacing: -0.01em;
                }

                .section-desc {
                    font-size: 0.72rem;
                    color: #7fa8b8;
                    margin: 1px 0 0;
                }

                /* ---- Info Banner ---- */
                .info-banner {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 11px 14px;
                    border-radius: 10px;
                    margin-bottom: 16px;
                    font-size: 0.78rem;
                    line-height: 1.5;
                }

                .info-banner.water-info {
                    background: linear-gradient(135deg, rgba(43,144,191,0.06), rgba(110,204,232,0.08));
                    border: 1px solid rgba(43,144,191,0.12);
                    color: #3a7a92;
                }

                .info-icon-wrap {
                    flex-shrink: 0;
                    margin-top: 1px;
                    color: #2b90bf;
                    opacity: 0.8;
                }

                .info-banner p { margin: 0; }

                /* ---- Notification Bar ---- */
                .notification-bar {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 14px;
                    border-radius: 10px;
                    font-size: 0.78rem;
                    font-weight: 600;
                    margin-bottom: 16px;
                    animation: slideInNotif 0.35s ease-out;
                }

                @keyframes slideInNotif {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .notif-error {
                    background: linear-gradient(135deg, #fef2f2, #fee2e2);
                    color: #b91c1c;
                    border: 1px solid rgba(185,28,28,0.15);
                }

                .notif-success {
                    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
                    color: #166534;
                    border: 1px solid rgba(22,101,52,0.15);
                }

                .notif-icon {
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                    font-weight: 800;
                    flex-shrink: 0;
                }

                .notif-error .notif-icon {
                    background: rgba(185,28,28,0.12);
                }

                .notif-success .notif-icon {
                    background: rgba(22,101,52,0.12);
                }

                /* ---- Form ---- */
                .profile-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    max-width: 800px;
                }

                .form-field {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .field-label {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.68rem;
                    font-weight: 700;
                    color: #4a8298;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    margin-left: 1px;
                }

                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .water-input {
                    width: 100%;
                    padding: 11px 14px;
                    padding-right: 40px;
                    border: 1.5px solid rgba(43,144,191,0.15);
                    border-radius: 10px;
                    font-size: 0.84rem;
                    color: #1a3a4a;
                    background: rgba(249,253,255,0.8);
                    outline: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: inherit;
                }

                .water-input::placeholder {
                    color: #a0becb;
                }

                .water-input:focus {
                    border-color: #2b90bf;
                    box-shadow: 0 0 0 3px rgba(43,144,191,0.1), 0 2px 12px rgba(43,144,191,0.08);
                    background: #ffffff;
                }

                .water-input.disabled {
                    background: rgba(234,244,249,0.6);
                    color: #7a9caa;
                    cursor: not-allowed;
                    border-color: rgba(43,144,191,0.08);
                }

                .water-input.input-mismatch {
                    border-color: #ef4444;
                    box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
                }

                .water-input.input-match {
                    border-color: #22c55e;
                    box-shadow: 0 0 0 3px rgba(34,197,94,0.1);
                }

                .input-water-accent {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%) scaleX(0);
                    width: 80%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #2b90bf, transparent);
                    border-radius: 2px;
                    transition: transform 0.3s ease;
                }

                .water-input:focus ~ .input-water-accent {
                    transform: translateX(-50%) scaleX(1);
                }

                .input-lock-icon {
                    position: absolute;
                    right: 14px;
                    color: #b0c8d4;
                    display: flex;
                }

                .toggle-password-btn {
                    position: absolute;
                    right: 12px;
                    background: none;
                    border: none;
                    color: #8ab4c6;
                    cursor: pointer;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    transition: all 0.2s;
                    z-index: 2;
                }

                .toggle-password-btn:hover {
                    color: #2b90bf;
                    background: rgba(43,144,191,0.08);
                }

                /* ---- Password Strength ---- */
                .password-strength {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .strength-bar {
                    flex: 1;
                    height: 4px;
                    background: rgba(43,144,191,0.08);
                    border-radius: 4px;
                    overflow: hidden;
                }

                .strength-fill {
                    height: 100%;
                    border-radius: 4px;
                    transition: width 0.4s ease, background 0.4s ease;
                }

                .strength-fill.weak { background: linear-gradient(90deg, #ef4444, #f97316); }
                .strength-fill.medium { background: linear-gradient(90deg, #f59e0b, #eab308); }
                .strength-fill.strong { background: linear-gradient(90deg, #22c55e, #2b90bf); }

                .strength-label {
                    font-size: 0.7rem;
                    font-weight: 700;
                    white-space: nowrap;
                }

                .strength-label.weak { color: #ef4444; }
                .strength-label.medium { color: #f59e0b; }
                .strength-label.strong { color: #22c55e; }

                .match-indicator {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #22c55e;
                    margin-left: 2px;
                    animation: slideInNotif 0.3s ease-out;
                }

                /* ---- Submit Button ---- */
                .water-submit-btn {
                    position: relative;
                    width: 100%;
                    padding: 12px 20px;
                    margin-top: 4px;
                    border: none;
                    border-radius: 12px;
                    font-size: 0.84rem;
                    font-weight: 700;
                    cursor: pointer;
                    font-family: inherit;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    color: #ffffff;
                    background: linear-gradient(135deg, #1e7399 0%, #3194b8 50%, #4aabcc 100%);
                    background-size: 200% 200%;
                    box-shadow: 0 3px 12px rgba(43,144,191,0.25), 0 1px 2px rgba(0,0,0,0.06);
                    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    animation: gradientShift 5s ease infinite;
                }

                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                .water-submit-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 5px 20px rgba(43,144,191,0.3), 0 2px 4px rgba(0,0,0,0.08);
                }

                .water-submit-btn:active:not(:disabled) {
                    transform: translateY(0);
                }

                .water-submit-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    animation: none;
                }

                .btn-ripple {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
                    transform: translateX(-100%);
                    animation: btnRipple 3s ease-in-out infinite;
                }

                @keyframes btnRipple {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                    100% { transform: translateX(100%); }
                }

                .water-submit-btn:disabled .btn-ripple {
                    animation: none;
                }

                /* ---- Loading Spinner ---- */
                .loading-spinner {
                    width: 18px;
                    height: 18px;
                    border: 2.5px solid rgba(255,255,255,0.3);
                    border-top-color: #ffffff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* ---- Tab Content Animation ---- */
                .tab-content-animated {
                    animation: tabSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                @keyframes tabSlideIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* ---- Footer ---- */
                .profile-water-footer {
                    margin-top: 16px;
                    opacity: 0.6;
                }

                /* ---- Responsive ---- */
                @media (max-width: 600px) {
                    .profile-water-header {
                        padding: 18px 16px 32px;
                    }

                    .profile-title {
                        font-size: 1.05rem;
                    }

                    .profile-glass-card {
                        padding: 18px 16px;
                        border-radius: 12px;
                    }

                    .profile-tab-btn {
                        padding: 9px 10px;
                        font-size: 0.75rem;
                    }

                    .water-bubble { display: none; }
                }

                /* DARK MODE OVERRIDES */
                body.dark-theme .profile-page-water {
                    background: #0f172a;
                }
                body.dark-theme .profile-water-header {
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                }
                body.dark-theme .profile-title,
                body.dark-theme .section-title-text {
                    color: #f8fafc;
                }
                body.dark-theme .profile-subtitle,
                body.dark-theme .section-desc {
                    color: #cbd5e1;
                }
                body.dark-theme .profile-tab-btn {
                    background: #1e293b;
                    color: #e2e8f0;
                }
                body.dark-theme .profile-tab-btn.active {
                    background: #0369a1;
                    color: #ffffff;
                }
                body.dark-theme .profile-glass-card {
                    background: #1e293b;
                    border: 1px solid #334155;
                }
                body.dark-theme .info-banner {
                    background: #0f172a;
                    color: #e2e8f0;
                }
                body.dark-theme .input-label {
                    color: #e2e8f0;
                }
                body.dark-theme .water-input {
                    background: #0f172a;
                    border: 1px solid #334155;
                    color: #f8fafc;
                }
                body.dark-theme .water-input::placeholder {
                    color: #64748b;
                }
                body.dark-theme .water-input:focus {
                    background: #0f172a;
                    border-color: #38bdf8;
                }
                body.dark-theme .wave-layer-1 {
                    fill: rgba(15, 23, 42, 0.6);
                }
                body.dark-theme .wave-layer-2 {
                    fill: #0f172a;
                }
            `}</style>
        </div>
    )
}
// Linked to SCRUM-166
