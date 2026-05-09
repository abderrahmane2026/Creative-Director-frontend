import React, { useState, useEffect } from 'react';
import './landingpage.css';
import Booking from '../Booking/Booking';
import { getAllWorks, getClients, getWorkById, rateWork } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const SERVICES = [
  { icon: '🎬', title: 'Video Production',   desc: 'Professional video shooting for restaurants, products & brands. From lighting to creative direction.' },
  { icon: '📸', title: 'Photography',        desc: 'Professional photography for food, products & portraits. Photos that tell your brand story.' },
  { icon: '✂️', title: 'Video Editing',      desc: 'Professional editing with motion graphics, color grading & storytelling for every platform.' },
  { icon: '🎉', title: 'Events Coverage',    desc: 'Full coverage for events & occasions: grand openings, exhibitions & special events.' },
  { icon: '🤖', title: 'AI Video Creation',  desc: 'Innovative AI-powered video production. Future content that sets your brand apart.' },
  { icon: '🍽️', title: 'Restaurant Content', desc: 'Specialized in restaurant content: food photography, reels & visual marketing for social media.' },
];

const STATS = [
  { number: '50+', label: 'Projects' },
  { number: '30+', label: 'Restaurants' },
  { number: '5+',  label: 'Years Exp.' },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/abderrahmane_qr/' },
  { label: 'TikTok',    href: 'https://www.tiktok.com/@abderrahmane_qr' },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/abderrahmane-berguellah-789629255/' },
];
const CATEGORIES = [
  'all', 'restaurant', 'automotive', 'events',
  'podcast', 'corporate', 'products', 'portrait', 'hospitality',
];

const TYPE_CARDS = [
  { type: 'photo', icon: '📸', label: 'Photography', desc: 'Professional food, product & portrait photography' },
  { type: 'video', icon: '🎬', label: 'Video',        desc: 'Promotional videos, reels & professional editing' },
  { type: 'ai',    icon: '🤖', label: 'AI Content',   desc: 'Innovative content with artificial intelligence' },
];

function SectionHeader({ tag, num }) {
  return (
    <div className="section__header">
      <span className="section__tag">{tag}</span>
      <div className="section__line" />
      <span className="section__num">{num}</span>
    </div>
  );
}

// ── Modal Component ──
function WorkModal({ workId, onClose }) {
  const [work, setWork]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating]   = useState(0);
  const [hover, setHover]     = useState(0);
  const [rated, setRated]     = useState(false);

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

// ── Main Component ──
function Portfolio() {
  const navigate                          = useNavigate();
  const [page, setPage]                   = useState('home');
  const [works, setWorks]                 = useState([]);
  const [clients, setClients]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedType, setSelectedType]   = useState(null);
  const [selectedCat, setSelectedCat]     = useState('all');
  const [selectedWork, setSelectedWork]   = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [w, c] = await Promise.all([getAllWorks(), getClients()]);
        if (w.success) setWorks(w.data);
        if (c.success) setClients(c.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const goHome = () => {
    setPage('home');
    window.scrollTo({ top: 0 });
  };

  const filteredWorks = works.filter((w) => {
    const matchType = selectedType ? w.type === selectedType : true;
    const matchCat  = selectedCat === 'all' ? true : w.category === selectedCat;
    return matchType && matchCat;
  });

  if (page === 'booking') {
    return <Booking onBack={goHome} />;
  }

  return (
    <div className="portfolio">

      {/* Modal */}
      {selectedWork && (
        <WorkModal
          workId={selectedWork}
          onClose={() => setSelectedWork(null)}
        />
      )}

      {/* NAV */}
      <nav className="nav">
        <div className="nav__logo">AC.</div>
        <ul className="nav__links">
          {['about', 'services', 'work', 'clients', 'contact'].map((id) => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__grid" />
        <div className="hero__content">
          <div className="hero__tag">Creative Director &amp; Content Creator</div>
          <h1 className="hero__title">
            Abderrahmane<br /><em>Creative.</em>
          </h1>
          <p className="hero__subtitle">
            Professional photographer, videographer & content creator.
            I transform your ideas into visual content that leaves a mark.
          </p>
          <div className="hero__cta">
            <button className="btn-primary" onClick={() => scrollTo('work')}>View Work</button>
            <button className="btn-outline" onClick={() => setPage('booking')}>Book a Session</button>
          </div>
        </div>
        <div className="hero__stats">
          {STATS.map(({ number, label }) => (
            <div className="stat" key={label}>
              <div className="stat__number">{number}</div>
              <div className="stat__label">{label}</div>
            </div>
            


        




          ))}
            <div className="social-links">
            {SOCIAL_LINKS.map(({ label, href }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <span className="social-sep">·</span>}
                <a className="social-link" href={href}>{label}</a>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section about-section">
        <SectionHeader tag="About Me" num="00" />
        <div className="about-inner">

          <div className="about-img-wrapper">
            <img
              src="/images/abderrahmane.jpg"
              alt="Abderrahmane"
              className="about-img"
            />
            <div className="about-img-border" />
          </div>

          <div className="about-content">
            <div className="about-tag">📍 Doha, Qatar</div>
            <h2 className="about-name">
              Abderrahmane<br /><em>Berguellah</em>
            </h2>
            <h3 className="about-role">
              Creative Director & Content Creator
            </h3>
            <p className="about-desc">
              Professional photographer & videographer with over 5 years of experience
              in Qatar and the region. Specialized in restaurant content, events & brands.
              I believe every photo and every video tells a story — my mission is to tell
              yours in the best way possible.
            </p>

            <div className="about-stats">
              {STATS.map(({ number, label }) => (
                <div className="about-stat" key={label}>
                  <div className="about-stat__number">{number}</div>
                  <div className="about-stat__label">{label}</div>
                </div>
              ))}
            </div>

            <div className="about-cta">
              <button className="btn-primary" onClick={() => setPage('booking')}>
                Work With Me
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="section">
        <SectionHeader tag="What I Do" num="01" />
        <h2 className="section__title">Creative <em>Services</em></h2>
        <div className="services-grid">
          {SERVICES.map(({ icon, title, desc }) => (
            <div className="service-card" key={title}>
              <span className="service-card__icon">{icon}</span>
              <h3 className="service-card__title">{title}</h3>
              <p className="service-card__desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="section section--dark">
        <SectionHeader tag="Portfolio" num="02" />
        <h2 className="section__title">Selected <em>Work</em></h2>

        {!selectedType ? (
          <div className="type-cards">
            {TYPE_CARDS.map(({ type, icon, label, desc }) => (
              <div
                key={type}
                className="type-card"
                onClick={() => navigate("/works/" + type)}
              >
                <div className="type-card__icon">{icon}</div>
                <h3 className="type-card__label">{label}</h3>
                <p className="type-card__desc">{desc}</p>
                <div className="type-card__count">
                  {works.filter((w) => w.type === type).length} works
                </div>
                <div className="type-card__arrow">→</div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <button
              className="type-back"
              onClick={() => { setSelectedType(null); setSelectedCat('all'); }}
            >
              ← Back
            </button>

            <div className="cat-filters">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={"cat-filter" + (selectedCat === cat ? " cat-filter--active" : "")}
                  onClick={() => setSelectedCat(cat)}
                >
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="work-loading">Loading...</div>
            ) : filteredWorks.length === 0 ? (
              <div className="work-empty">No works found.</div>
            ) : (
              <div className="works-grid">
                {filteredWorks.map((w) => (
                  <div
                    key={w._id}
                    className="work-card"
                    onClick={() => setSelectedWork(w._id)}
                  >
                    <div className="work-card__media">
                      {w.type === 'video' || w.type === 'ai' ? (
                        <video src={w.url} className="work-card__img" />
                      ) : (
                        <img src={w.url} alt={w.title} className="work-card__img" />
                      )}
                    </div>
                    <div className="work-card__overlay">
                      <div className="work-card__info">
                        <h4 className="work-card__title">{w.title}</h4>
                        <span className="work-card__cat">{w.category}</span>
                      </div>
                      {w.averageRating > 0 && (
                        <div className="work-card__rating">★ {w.averageRating}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* CLIENTS */}
      <section id="clients" className="section section--center">
        <SectionHeader tag="Experience" num="03" />
        <h2 className="section__title">
          Worked With <em>Restaurants</em><br />&amp; Brands
        </h2>
        <div className="clients-row">
          {clients.length === 0 ? (
            <div className="client-pill">No clients yet</div>
          ) : (
            clients.map((c) => (
              <div className="client-pill" key={c._id}>{c.name}</div>
            ))
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section section--dark section--center">
        <SectionHeader tag="Get In Touch" num="04" />
        <div className="contact__inner">
          <h2 className="section__title">
            Let's Create<br /><em>Something Great</em>
          </h2>
          <p className="contact__desc">
            Have a project in mind? Whether it's a restaurant shoot, event coverage,
            or creative AI content — I'm here to turn your idea into reality.
          </p>
          <button className="btn-primary" onClick={() => setPage('booking')}>
            Book a Session
          </button>
          <div className="social-links">
            {SOCIAL_LINKS.map(({ label, href }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <span className="social-sep">·</span>}
                <a className="social-link" href={href}>{label}</a>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2025 Abderrahmane Creative</p>
        <p>Made with <span className="gold-dot" /> Passion</p>
      </footer>

    </div>
  );
}

export default Portfolio;