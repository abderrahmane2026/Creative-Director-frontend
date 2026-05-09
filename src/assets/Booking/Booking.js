import React, { useState } from 'react';
import './Booking.css';

const API_URL = process.env.REACT_APP_API_URL;

const SERVICES = [
  { id: 'video',      label: 'Video Production',   icon: '🎬' },
  { id: 'photo',      label: 'Photography',         icon: '📸' },
  { id: 'editing',    label: 'Video Editing',       icon: '✂️' },
  { id: 'event',      label: 'Events Coverage',     icon: '🎉' },
  { id: 'ai',         label: 'AI Video Creation',   icon: '🤖' },
  { id: 'restaurant', label: 'Restaurant Content',  icon: '🍽️' },
];

const BUDGETS = ['< 500', '500 – 1,000', '1,000 – 3,000', '3,000+'];

const STEPS = ['Service', 'Details', 'Confirm'];

function Booking({ onBack }) {
  const [step, setStep]           = useState(0);
  const [selected, setSelected]   = useState([]);
  const [budget, setBudget]       = useState('');
  const [form, setForm]           = useState({ name: '', email: '', phone: '', date: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const toggleService = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const canNext = () => {
    if (step === 0) return selected.length > 0 && budget !== '';
    if (step === 1) return form.name && form.email && form.date;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     form.name,
          email:    form.email,
          phone:    form.phone,
          date:     form.date,
          notes:    form.notes,
          budget:   budget,
          services: selected,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError('Something went wrong, please try again.');
      }
    } catch (err) {
      setError('Connection error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="booking">
        <nav className="bk-nav">
          <button className="bk-back" onClick={onBack}>
            <span>←</span> Back to Portfolio
          </button>
          <div className="bk-nav__logo">AC.</div>
        </nav>
        <div className="bk-success">
          <div className="bk-success__icon">✅</div>
          <h2>Booking Confirmed!</h2>
          <p>Thank you <strong>{form.name}</strong>! I'll get back to you soon at <strong>{form.email}</strong></p>
          <button className="btn-primary" onClick={onBack}>Back to Portfolio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking">

      {/* NAV */}
      <nav className="bk-nav">
        <button className="bk-back" onClick={onBack}>
          <span>←</span> Back to Portfolio
        </button>
        <div className="bk-nav__logo">AC.</div>
      </nav>

      <div className="bk-body">

        {/* Header */}
        <div className="bk-header">
          <span className="bk-header__tag">Let's Work Together</span>
          <h1 className="bk-header__title">Book a <em>Session</em></h1>
          <p className="bk-header__sub">Book your creative session in simple steps</p>
        </div>

        {/* Stepper */}
        <div className="bk-stepper">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div className={`bk-step ${i === step ? 'bk-step--active' : ''} ${i < step ? 'bk-step--done' : ''}`}>
                <div className="bk-step__num">{i < step ? '✓' : i + 1}</div>
                <span className="bk-step__label">{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`bk-step__line ${i < step ? 'bk-step__line--done' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 0: SERVICE */}
        {step === 0 && (
          <div className="bk-panel">
            <h3 className="bk-panel__title">What do you need?</h3>
            <div className="bk-services">
              {SERVICES.map(({ id, label, icon }) => (
                <button
                  key={id}
                  className={`bk-service-btn ${selected.includes(id) ? 'bk-service-btn--active' : ''}`}
                  onClick={() => toggleService(id)}
                >
                  <span className="bk-service-btn__icon">{icon}</span>
                  <span className="bk-service-btn__label">{label}</span>
                  {selected.includes(id) && <span className="bk-service-btn__check">✓</span>}
                </button>
              ))}
            </div>

            <h3 className="bk-panel__title" style={{ marginTop: '2.5rem' }}>Budget Range</h3>
            <div className="bk-budgets">
              {BUDGETS.map((b) => (
                <button
                  key={b}
                  className={`bk-budget-btn ${budget === b ? 'bk-budget-btn--active' : ''}`}
                  onClick={() => setBudget(b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: DETAILS */}
        {step === 1 && (
          <div className="bk-panel">
            <h3 className="bk-panel__title">Your Details</h3>
            <div className="bk-form">
              <div className="bk-field">
                <label className="bk-label">Full Name *</label>
                <input
                  className="bk-input"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="bk-field">
                <label className="bk-label">Email *</label>
                <input
                  className="bk-input"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="bk-field">
                <label className="bk-label">Phone</label>
                <input
                  className="bk-input"
                  type="tel"
                  name="phone"
                  placeholder="+974 XX XXX XXXX"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="bk-field">
                <label className="bk-label">Preferred Date *</label>
                <input
                  className="bk-input"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>
              <div className="bk-field bk-field--full">
                <label className="bk-label">Project Notes</label>
                <textarea
                  className="bk-input bk-textarea"
                  name="notes"
                  placeholder="Tell me about your project, brand, vision..."
                  value={form.notes}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CONFIRM */}
        {step === 2 && (
          <div className="bk-panel">
            <h3 className="bk-panel__title">Booking Summary</h3>
            <div className="bk-summary">
              <div className="bk-summary__row">
                <span className="bk-summary__key">Services</span>
                <span className="bk-summary__val">
                  {selected.map((id) => SERVICES.find((s) => s.id === id)?.label).join(', ')}
                </span>
              </div>
              <div className="bk-summary__row">
                <span className="bk-summary__key">Budget</span>
                <span className="bk-summary__val">{budget}</span>
              </div>
              <div className="bk-summary__row">
                <span className="bk-summary__key">Name</span>
                <span className="bk-summary__val">{form.name}</span>
              </div>
              <div className="bk-summary__row">
                <span className="bk-summary__key">Email</span>
                <span className="bk-summary__val">{form.email}</span>
              </div>
              {form.phone && (
                <div className="bk-summary__row">
                  <span className="bk-summary__key">Phone</span>
                  <span className="bk-summary__val">{form.phone}</span>
                </div>
              )}
              <div className="bk-summary__row">
                <span className="bk-summary__key">Date</span>
                <span className="bk-summary__val">{form.date}</span>
              </div>
              {form.notes && (
                <div className="bk-summary__row bk-summary__row--notes">
                  <span className="bk-summary__key">Notes</span>
                  <span className="bk-summary__val">{form.notes}</span>
                </div>
              )}
            </div>

            {error && (
              <div className="bk-error">{error}</div>
            )}
          </div>
        )}

        {/* NAV BUTTONS */}
        <div className="bk-actions">
          {step > 0 && (
            <button className="btn-outline" onClick={() => setStep((s) => s - 1)}>
              Previous
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              className="btn-primary"
              disabled={!canNext()}
              onClick={() => setStep((s) => s + 1)}
            >
              Next Step
            </button>
          ) : (
            <button
              className="btn-primary"
              disabled={!canNext() || loading}
              onClick={handleSubmit}
            >
              {loading ? 'Sending...' : 'Confirm Booking'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default Booking;