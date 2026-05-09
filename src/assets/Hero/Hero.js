
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="grid-bg"></div>
      <div className="glow-orb orb1"></div>
      <div className="glow-orb orb2"></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          dev<span>.</span>portfolio
        </div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#blog">Blog</a></li>
        </ul>
        <button className="nav-cta">Hire Me</button>
      </nav>

      {/* Hero Body */}
      <div className="hero-body">
        <div className="hero-content">

          <div className="badge">
            <span className="badge-dot"></span>
            Available for freelance work
          </div>

          <h1 className="hero-title">
            <span className="line1">Hi, I'm</span>
            <span className="line2 accent">Your Name</span>
            <span className="line3">Full Stack Developer</span>
          </h1>

          <p className="hero-desc">
            I build fast, beautiful, and accessible web experiences — from
            pixel-perfect UIs to robust backend systems. Passionate about
            clean code and thoughtful design.
          </p>

          <div className="hero-actions">
            <button className="btn-primary">
              View My Work <span>→</span>
            </button>
            <button className="btn-secondary">
              Download CV <span>↓</span>
            </button>
          </div>

          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="social-btn">GH</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-btn">in</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn">X</a>
            <a href="mailto:you@email.com" className="social-btn">✉</a>
          </div>

          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-num">3<span>+</span></div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">20<span>+</span></div>
              <div className="stat-label">Projects Shipped</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">10<span>+</span></div>
              <div className="stat-label">Happy Clients</div>
            </div>
          </div>
        </div>

        {/* Code Card Visual */}
        <div className="hero-visual">
          <div className="visual-wrapper">
            <div className="floating-tag tag1">
              <span className="tag-dot green"></span>
              React &amp; Next.js
            </div>

            <div className="code-card">
              <div className="code-top">
                <div className="dot dot-r"></div>
                <div className="dot dot-y"></div>
                <div className="dot dot-g"></div>
              </div>
              <div className="code-line"><span className="c-gray">// developer.js</span></div>
              <div className="code-line"><span className="c-purple">const</span> <span className="c-white">dev</span> <span className="c-gray">=</span> <span className="c-gray">{"{"}</span></div>
              <div className="code-line">&nbsp;&nbsp;<span className="c-teal">name</span><span className="c-gray">:</span> <span className="c-orange">"Your Name"</span><span className="c-gray">,</span></div>
              <div className="code-line">&nbsp;&nbsp;<span className="c-teal">role</span><span className="c-gray">:</span> <span className="c-orange">"Full Stack"</span><span className="c-gray">,</span></div>
              <div className="code-line">&nbsp;&nbsp;<span className="c-teal">skills</span><span className="c-gray">: [</span></div>
              <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="c-orange">"React"</span><span className="c-gray">,</span> <span className="c-orange">"Node"</span><span className="c-gray">,</span></div>
              <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;<span className="c-orange">"TypeScript"</span><span className="c-gray">,</span></div>
              <div className="code-line">&nbsp;&nbsp;<span className="c-gray">],</span></div>
              <div className="code-line">&nbsp;&nbsp;<span className="c-teal">open</span><span className="c-gray">:</span> <span className="c-purple">true</span></div>
              <div className="code-line"><span className="c-gray">{"}"};</span></div>
            </div>

            <div className="floating-tag tag2">
              <span className="tag-dot purple"></span>
              TypeScript · Node.js
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
