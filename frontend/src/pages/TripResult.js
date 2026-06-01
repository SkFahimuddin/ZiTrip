import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const CATEGORY_COLORS = {
  'Nature': 'tag-teal',
  'History': 'tag-amber',
  'Adventure': 'tag-accent',
  'Culture': 'tag-amber',
  'Beach': 'tag-teal',
  'Food': 'tag-accent',
  'Shopping': 'tag-accent',
};

const SPOT_ICONS = ['🏛', '🌄', '🏖', '🌿', '⛩', '🗼', '🎭', '🏰', '🌊', '🎑', '🌁', '🏯'];
const FOOD_ICONS = ['🍜', '🥘', '🍛', '🫕', '🥗', '🍱', '🫙', '🥧', '🍢', '🫔'];

const TripResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const { data } = await api.get(`/trip/${id}`);
        setTrip(data.trip);
      } catch (err) {
        setError('Trip not found or you do not have access.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 80, gap: 16 }}>
        <div className="loader" style={{ width: 48, height: 48 }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading your trip plan...</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="alert alert-error">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ marginTop: 20 }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  const { result, destination, days, budget, travelDate } = trip;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div className="fade-in" style={{ marginBottom: 40 }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: 24, padding: 0 }}
          >
            ← Back to dashboard
          </button>

          <div style={{
            background: 'linear-gradient(135deg, var(--bg-elevated), var(--bg-card))',
            border: '1px solid var(--border)',
            borderRadius: 24, padding: '36px 32px',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <p style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
              ✦ Your AI Travel Plan
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.03em', marginBottom: 16 }}>
              {destination}
            </h1>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
              {days && <span className="tag tag-accent">📅 {days} days</span>}
              {budget && <span className="tag tag-teal">💰 {budget}</span>}
              {travelDate && <span className="tag tag-amber">🗓 {travelDate}</span>}
            </div>

            {result?.overview && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 680 }}>
                {result.overview}
              </p>
            )}
          </div>
        </div>

        {/* Tourist Spots */}
        {result?.tourist_spots?.length > 0 && (
          <section className="fade-in" style={{ marginBottom: 48, animationDelay: '0.1s' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: 'var(--accent)' }}>🗺</span> Top Places to Visit
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {result.tourist_spots.map((spot, i) => (
                <div key={i} className="card" style={{
                  padding: 20,
                  transition: 'all 0.2s',
                  animationDelay: `${i * 0.05}s`
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ fontSize: 28 }}>{SPOT_ICONS[i % SPOT_ICONS.length]}</span>
                    {spot.category && (
                      <span className={`tag ${CATEGORY_COLORS[spot.category] || 'tag-accent'}`}>{spot.category}</span>
                    )}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>
                    {spot.name}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 12 }}>
                    {spot.description}
                  </p>
                  {spot.best_time && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ⏰ Best time: <span style={{ color: 'var(--accent2)' }}>{spot.best_time}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Famous Food */}
        {result?.famous_food?.length > 0 && (
          <section className="fade-in" style={{ marginBottom: 48, animationDelay: '0.2s' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>🍽</span> Must-Try Food
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {result.famous_food.map((food, i) => (
                <div key={i} className="card" style={{ padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 26, flexShrink: 0 }}>{FOOD_ICONS[i % FOOD_ICONS.length]}</span>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{food.name}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5 }}>{food.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Special Info */}
        {result?.special_info && (
          <section className="fade-in" style={{ marginBottom: 48, animationDelay: '0.25s' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>✨</span> Local Secrets & Tips
            </h2>
            <div style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-bright)',
              borderLeft: '3px solid var(--accent)',
              borderRadius: 12,
              padding: '20px 24px'
            }}>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>{result.special_info}</p>
            </div>
          </section>
        )}

        {/* Itinerary */}
        {result?.itinerary?.length > 0 && (
          <section className="fade-in" style={{ marginBottom: 48, animationDelay: '0.3s' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>📋</span> Day-by-Day Itinerary
            </h2>

            {/* Day tabs */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {result.itinerary.map((day, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 100,
                    border: `1px solid ${activeDay === i ? 'var(--accent)' : 'var(--border)'}`,
                    background: activeDay === i ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                    color: activeDay === i ? 'var(--accent)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    transition: 'all 0.2s'
                  }}
                >
                  Day {day.day}
                </button>
              ))}
            </div>

            {result.itinerary[activeDay] && (
              <div className="card" style={{ padding: 28 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 24, color: 'var(--accent)' }}>
                  Day {result.itinerary[activeDay].day} — {result.itinerary[activeDay].title}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {result.itinerary[activeDay].slots?.map((slot, si) => (
                    <div key={si} style={{ display: 'flex', gap: 20, position: 'relative' }}>
                      {/* Timeline line */}
                      {si < result.itinerary[activeDay].slots.length - 1 && (
                        <div style={{ position: 'absolute', left: 55, top: 32, width: 1, height: '100%', background: 'var(--border)' }} />
                      )}

                      {/* Time */}
                      <div style={{ width: 70, flexShrink: 0, paddingTop: 14 }}>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--accent)', whiteSpace: 'nowrap' }}>
                          {slot.time}
                        </span>
                      </div>

                      {/* Dot */}
                      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 18 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)', flexShrink: 0 }} />
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, padding: '12px 0 24px' }}>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>
                          {slot.activity}
                        </h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                          {slot.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', paddingBottom: 20 }}>
          <button className="btn btn-primary" onClick={() => navigate('/plan')}>
            ✦ Plan Another Trip
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
        </div>

      </main>
    </div>
  );
};

export default TripResult;
