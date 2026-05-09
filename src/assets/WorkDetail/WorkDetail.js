import React, { useState, useEffect } from 'react';
import './WorkDetail.css';
import { getWorkById, rateWork } from '../../services/api';

function WorkDetail({ workId, onBack }) {
  const [work, setWork]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [rating, setRating]     = useState(0);
  const [hover, setHover]       = useState(0);
  const [rated, setRated]       = useState(false);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const data = await getWorkById(workId);
        if (data.success) setWork(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWork();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (loading) return (
    <div className="work-detail">
      <nav className="wd-nav">
        <button className="wd-back" onClick={onBack}>
          <span className="wd-back__arrow">←</span>
          Back to Portfolio
        </button>
        <div className="wd-nav__logo">CD.</div>
      </nav>
      <div className="wd-loading">Loading...</div>
    </div>
  );

  if (!work) return (
    <div className="work-detail">
      <nav className="wd-nav">
        <button className="wd-back" onClick={onBack}>
          <span className="wd-back__arrow">←</span>
          Back to Portfolio
        </button>
        <div className="wd-nav__logo">CD.</div>
      </nav>
      <div className="wd-loading">Work not found</div>
    </div>
  );

  return (
    <div className="work-detail">

      {/* NAV */}
      <nav className="wd-nav">
        <button className="wd-back" onClick={onBack}>
          <span className="wd-back__arrow">←</span>
          Back to Portfolio
        </button>
        <div className="wd-nav__logo">CD.</div>
      </nav>

      {/* HERO MEDIA */}
      <div className="wd-hero-media">
        {work.type === 'video' || work.type === 'ai' || work.type === 'animation' ? (
          <video src={work.url} controls className="wd-hero-video" />
        ) : (
          <img src={work.url} alt={work.title} className="wd-hero-img" />
        )}
      </div>

      {/* BODY */}
      <div className="wd-body">

        {/* Title & Meta */}
        <div className="wd-title-section">
          <h1 className="wd-hero__title">{work.title}</h1>
          <div className="wd-hero__meta">
            <span className="wd-tag">{work.type}</span>
            <span className="wd-sep">·</span>
            <span className="wd-tag">{work.category}</span>
            {work.client && (
              <>
                <span className="wd-sep">·</span>
                <span>{work.client.name}</span>
              </>
            )}
            {work.year && (
              <>
                <span className="wd-sep">·</span>
                <span>{work.year}</span>
              </>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="wd-rating-section">
          <div className="wd-rating-label">Rate this work</div>
          <div className="wd-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`wd-star ${(hover || rating) >= star ? 'wd-star--active' : ''}`}
                onClick={() => handleRate(star)}
                onMouseEnter={() => !rated && setHover(star)}
                onMouseLeave={() => !rated && setHover(0)}
                disabled={rated}
              >
                ★
              </button>
            ))}
          </div>
          <div className="wd-rating-info">
            {work.averageRating > 0 && (
              <span>{work.averageRating} ★ ({work.totalRatings} {work.totalRatings === 1 ? 'vote' : 'votes'})</span>
            )}
            {rated && <span className="wd-rated-msg"> · Thank you! 🎉</span>}
          </div>
        </div>

        {/* CTA */}
        <div className="wd-cta-section">
          <p>أعجبك هذا العمل؟ دعنا نصنع شيئاً مشابهاً لعلامتك التجارية.</p>
          <button className="btn-primary" onClick={onBack}>
            Book a Session
          </button>
        </div>

      </div>
    </div>
  );
}

export default WorkDetail;