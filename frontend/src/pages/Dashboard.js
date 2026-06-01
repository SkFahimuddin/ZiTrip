import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const EMOJIS = ['🗼', '🏝', '🏔', '🌆', '🗺', '🧭', '🌊', '🏛', '🌋', '🎑'];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const { data } = await api.get('/trip/my');
      setTrips(data.trips);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await api.delete(`/trip/${id}`);
      setTrips(trips.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {/* Hero */}
        <div className="fade-in" style={{ marginBottom: 48 }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-card) 100%)',
            border: '1px solid var(--border)',
            borderRadius: 24,
            padding: '48px 40px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background glow */}
            <div style={{
              position: 'absolute', top: -60, right: -60,
              width: 300, height: 300,
              background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute', bottom: -40, left: 40,
              width: 200, height: 200,
              background: 'radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            <p style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              ✦ AI Travel Planner
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              lineHeight: 1.15, letterSpacing: '-0.03em',
              marginBottom: 16
            }}>
              Where do you want<br />
              to go, <span style={{ color: 'var(--accent)' }}>{user?.name?.split(' ')[0]}</span>?
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 28, maxWidth: 480 }}>
              Tell the AI your destination and get a complete travel plan — tourist spots, local food, and a day-by-day itinerary.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/plan')} style={{ padding: '14px 32px', fontSize: '0.95rem' }}>
              ✦ Start a New Trip
            </button>
          </div>
        </div>

        {/* Stats row */}
        {trips.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
            {[
              { label: 'Trips Planned', value: trips.length, color: 'var(--accent)' },
              { label: 'Destinations', value: [...new Set(trips.map(t => t.destination))].length, color: 'var(--accent2)' },
              { label: 'Latest Trip', value: trips[0]?.destination?.split(',')[0] || '—', color: 'var(--accent-amber)' }
            ].map((s, i) => (
              <div key={i} className="card fade-in" style={{ textAlign: 'center', padding: '20px 16px', animationDelay: `${i * 0.1}s` }}>
                <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Past Trips */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 20, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Past Trips
          </h2>

          {loadingTrips ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
              <div className="loader" />
            </div>
          ) : trips.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '56px 24px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🌍</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>No trips yet — your adventures start here.</p>
              <button className="btn btn-primary" onClick={() => navigate('/plan')} style={{ marginTop: 20 }}>
                Plan My First Trip
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {trips.map((trip, i) => (
                <div
                  key={trip._id}
                  className="card fade-in"
                  onClick={() => navigate(`/trip/${trip._id}`)}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    animationDelay: `${i * 0.05}s`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ fontSize: 32 }}>{EMOJIS[i % EMOJIS.length]}</span>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      onClick={e => handleDelete(trip._id, e)}
                      disabled={deletingId === trip._id}
                    >
                      {deletingId === trip._id ? '...' : '✕'}
                    </button>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>
                    {trip.destination}
                  </h3>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                    {trip.days && <span className="tag tag-accent">{trip.days} days</span>}
                    {trip.budget && <span className="tag tag-teal">{trip.budget}</span>}
                    {trip.travelDate && <span className="tag tag-amber">{trip.travelDate}</span>}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Planned on {formatDate(trip.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
