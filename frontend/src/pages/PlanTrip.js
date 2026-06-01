import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const PlanTrip = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ destination: '', days: '', budget: '', travelDate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.destination.trim()) { setError('Destination is required.'); return; }
    setError('');
    setLoading(true);
    try {
      const payload = { destination: form.destination.trim() };
      if (form.days) payload.days = Number(form.days);
      if (form.budget) payload.budget = form.budget.trim();
      if (form.travelDate) payload.travelDate = form.travelDate;

      const { data } = await api.post('/trip/plan', payload);
      navigate(`/trip/${data.trip._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
        <div className="fade-in">
          <button
            onClick={() => navigate('/dashboard')}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: 32, padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            ← Back to dashboard
          </button>

          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.03em', marginBottom: 8 }}>
            Plan Your Trip ✦
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 40 }}>
            Tell me where you're going. The more info you give, the better your plan.
          </p>

          {error && <div className="alert alert-error" style={{ marginBottom: 24 }}>{error}</div>}

          <div className="card" style={{ padding: 36 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Destination - Required */}
              <div className="input-group">
                <label>Destination <span className="required">*</span></label>
                <input
                  type="text"
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  placeholder="e.g. Goa, Tokyo, Paris, Manali..."
                  required
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>This is the only required field.</span>
              </div>

              <div style={{ height: 1, background: 'var(--border)' }} />

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Optional — for a better plan
              </p>

              {/* Travel Date */}
              <div className="input-group">
                <label>Travel Date</label>
                <input
                  type="date"
                  name="travelDate"
                  value={form.travelDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Days */}
              <div className="input-group">
                <label>Number of Days</label>
                <input
                  type="number"
                  name="days"
                  value={form.days}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  min="1"
                  max="30"
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Providing this enables a day-by-day itinerary.
                </span>
              </div>

              {/* Budget */}
              <div className="input-group">
                <label>Budget</label>
                <input
                  type="text"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="e.g. ₹50,000 or $1000 or budget / moderate / luxury"
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Can be an amount or a tier (budget, moderate, luxury).
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ padding: '16px', fontSize: '1rem', marginTop: 8, width: '100%', position: 'relative' }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} />
                    AI is planning your trip...
                  </span>
                ) : '✦ Generate My Trip Plan'}
              </button>

              {loading && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: -12 }}>
                  This may take 10–20 seconds. Hang tight!
                </p>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlanTrip;
