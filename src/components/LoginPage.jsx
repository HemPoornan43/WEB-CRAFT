import React, { useState } from 'react';
import { loginStudent, isSupabaseConfigured } from '../utils/supabase.js';

export default function LoginPage({ onLogin }) {
  const [registerNo, setRegisterNo] = useState('');
  const [password, setPassword]     = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [showPwd, setShowPwd]       = useState(false);

  // Core login logic — accepts credentials directly (avoids React state timing issues)
  const doLogin = async (regNo, pwd) => {
    if (!regNo.trim() || !pwd.trim()) {
      setError('Please enter both Register Number and Password.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const result = await loginStudent(regNo.trim(), pwd.trim());
      if (result.error) {
        setError(result.error);
      } else {
        onLogin(result.student, result.attendanceRows);
      }
    } catch (err) {
      setError('Unexpected error: ' + (err.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    doLogin(registerNo, password);
  };

  // Fill AND immediately login with demo credentials
  const handleDemo = () => {
    setRegisterNo('DEMO');
    setPassword('demo');
    doLogin('DEMO', 'demo');
  };

  return (
    <div className="login-page">
      {/* Animated background blobs */}
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />
      <div className="login-blob login-blob-3" />

      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <div className="login-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="m9 9.5 2 2 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="login-brand-title">AttendanceIQ</h1>
            <p className="login-brand-sub">VibeCraft 2026 · The Overworld · Round 1</p>
          </div>
        </div>

        {/* Heading */}
        <div className="login-heading">
          <h2>Student Login</h2>
          <p>Sign in with your Register Number to view your attendance dashboard</p>
        </div>

        {/* DB status banner */}
        <div className={`login-db-status ${isSupabaseConfigured ? 'connected' : 'demo'}`}>
          {isSupabaseConfigured ? (
            <><span>🟢</span> Connected to Supabase Database</>
          ) : (
            <><span>🟡</span> Demo Mode — No Supabase configured.{' '}
              <a href="#" onClick={e => { e.preventDefault(); }} style={{ color: '#fbbf24' }}>
                Set up .env.local to connect your DB
              </a>
            </>
          )}
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Register Number */}
          <div className="login-field">
            <label htmlFor="register-no" className="login-label">
              🎓 Register Number
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M16 10h.01M8 10h.01M12 10h.01M12 14h.01M8 14h.01M16 14h.01" />
                </svg>
              </span>
              <input
                id="register-no"
                type="text"
                className="login-input"
                placeholder="e.g. 21BCE0001"
                value={registerNo}
                onChange={e => setRegisterNo(e.target.value.toUpperCase())}
                autoComplete="username"
                autoFocus
                spellCheck={false}
              />
            </div>
            <span className="login-field-hint">Your unique college-assigned register number</span>
          </div>

          {/* Password */}
          <div className="login-field">
            <label htmlFor="login-password" className="login-label">
              🔒 Password
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="login-password"
                type={showPwd ? 'text' : 'password'}
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPwd(v => !v)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error" role="alert">
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            id="login-submit-btn"
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="login-spinner" />
            ) : (
              <>🚀 Login &amp; View Dashboard</>
            )}
          </button>
        </form>

        {/* Demo shortcut */}
        {!isSupabaseConfigured && (
          <div className="login-demo-row">
            <span className="login-demo-label">Testing?</span>
            <button type="button" className="login-demo-btn" onClick={handleDemo}>
              🎮 Fill Demo Credentials
            </button>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              (DEMO / demo)
            </span>
          </div>
        )}

        {/* Info */}
        <div className="login-footer-info">
          <div className="login-info-item">
            <span>📊</span>
            <span>Attendance automatically computed from your database records</span>
          </div>
          <div className="login-info-item">
            <span>🔮</span>
            <span>AI-powered what-if simulator &amp; leave impact analysis</span>
          </div>
          <div className="login-info-item">
            <span>🔒</span>
            <span>Your data is private and secured per-student</span>
          </div>
        </div>
      </div>
    </div>
  );
}
