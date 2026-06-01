import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 32px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-surface)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(12px)'
    }}>
      <Link to="/dashboard" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: 'var(--accent)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
            boxShadow: '0 0 16px var(--accent-glow)'
          }}>✦</div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.1rem',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em'
          }}>ZiTrip<span style={{ color: 'var(--accent)' }}></span></span>
        </div>
      </Link>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Hey, <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{user.name.split(' ')[0]}</strong>
          </span>
          <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
