import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllWorks, getWorkById, rateWork } from '../../services/api';
import './WorksPage.css';

const CATEGORIES = [
  'all', 'restaurant', 'automotive', 'events',
  'podcast', 'corporate', 'products', 'portrait', 'hospitality',
];

const TYPE_INFO = {
  photo: { icon: '📸', label: 'Photography' },
  video: { icon: '🎬', label: 'Video' },
  ai:    { icon: '🤖', label: 'AI Content' },
};

// ── Modal ──
function WorkModal({ workId, onClose }) {
  const [work, setWork]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating]   = useState(0);
  const [hover, setHover]     = useState(0);
  const [rated, setRated]     = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getWorkById(workId);
        if (data.success) setWork(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [workId]);

  const handleRate = async (value) => {
    if (rated) return;
    try {
      const data = await rateWork(workId, value);
      if (data.success) {
        setRating(value);
        setRated(true);
        setWork((prev) => ({
          ...prev,
          averageRating: data.averageRating,
          totalRatings:  data.totalRatings,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {loading ? (
          <div className="modal-loading">Loading...</div>
        ) : !work ? (
          <div className="modal-loading">Not found</div>
        ) : (
          <>
            <div className="modal-media">
              {work.type === 'video' || work.type === 'ai' ? (
                <video src={work.url} controls className="modal-video" />
              ) : (
                <img src={work.url} alt={work.title} className="modal-img" />
              )}
            </div>

            <div className="modal-info">
              <div className="modal-tags">
                <span className="modal-tag">{work.type}</span>
                <span className="modal-tag">{work.category}</span>
                {work.featured && <span className="modal-tag modal-tag--gold">⭐ Featured</span>}
              </div>

              <h2 className="modal-title">{work.title}</h2>

              <div className="modal-meta">
                {work.client && (
                  <div className="modal-meta-row">
                    <span className="modal-meta-label">Client</span>
                    <span className="modal-meta-value">{work.client.name}</span>
                  </div>
                )}
                {work.year && (
                  <div className="modal-meta-row">
                    <span className="modal-meta-label">Year</span>
                    <span className="modal-meta-value">{work.year}</span>
                  </div>
                )}
              </div>

              <div className="modal-rating">
                <div className="modal-rating-label">Rate this work</div>
                <div className="modal-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={"modal-star" + ((hover || rating) >= star ? " modal-star--active" : "")}
                      onClick={() => handleRate(star)}
                      onMouseEnter={() => !rated && setHover(star)}
                      onMouseLeave={() => !rated && setHover(0)}
                      disabled={rated}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {work.averageRating > 0 && (
                  <div className="modal-rating-info">
                    {work.averageRating} ★ ({work.totalRatings} {work.totalRatings === 1 ? 'vote' : 'votes'})
                    {rated && <span className="modal-rated-msg"> · Thank you! 🎉</span>}
                  </div>
                )}
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main ──
function WorksPage() {
  const { type }                          = useParams();
  const navigate                          = useNavigate();
  const [works, setWorks]                 = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedCat, setSelectedCat]     = useState('all');
  const [selectedWork, setSelectedWork]   = useState(null);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const data = await getAllWorks({ type });
        if (data.success) setWorks(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorks();
    window.scrollTo({ top: 0 });
  }, [type]);

  const filtered = selectedCat === 'all'
    ? works
    : works.filter((w) => w.category === selectedCat);

  const info = TYPE_INFO[type] || { icon: '🎬', label: type };

  return (
    <div className="works-page">

      {/* Modal */}
      {selectedWork && (
        <WorkModal
          workId={selectedWork}
          onClose={() => setSelectedWork(null)}
        />
      )}

      {/* NAV */}
      <nav className="wp-nav">
        <button className="wp-back" onClick={() => navigate('/')}>
          ← Back
        </button>
        <div className="wp-logo">AC.</div>
        <button className="wp-book" onClick={() => navigate('/')}>
          Book a Session
        </button>
      </nav>

      {/* Header */}
      <div className="wp-header">
        <div className="wp-icon">{info.icon}</div>
        <h1 className="wp-title">{info.label}</h1>
        <p className="wp-count">{works.length} works</p>
      </div>

      {/* Category Filter */}
      <div className="wp-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={"wp-filter" + (selectedCat === cat ? " wp-filter--active" : "")}
            onClick={() => setSelectedCat(cat)}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="wp-loading">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="wp-empty">No works found.</div>
      ) : (
        <div className="wp-grid">
          {filtered.map((w) => (
            <div
              key={w._id}
              className="wp-card"
              onClick={() => setSelectedWork(w._id)}
            >
              <div className="wp-card__media">
                {w.type === 'video' || w.type === 'ai' ? (
                  <video src={w.url} className="wp-card__img" />
                ) : (
                  <img src={w.url} alt={w.title} className="wp-card__img" />
                )}
              </div>
              <div className="wp-card__overlay">
                <div className="wp-card__info">
                  <h4 className="wp-card__title">{w.title}</h4>
                  <span className="wp-card__cat">{w.category}</span>
                </div>
                {w.averageRating > 0 && (
                  <div className="wp-card__rating">★ {w.averageRating}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default WorksPage;