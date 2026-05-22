import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
      <div className="about-hero">
        <div className="container">
          <div style={{maxWidth:640}}>
            <div className="hero-eyebrow">Our Story</div>
            <h1>We're Building the Future of <span>Tech Accessories</span></h1>
            <p>Pathnel Tech was born from a simple frustration: why is it so hard to find tech gear that's both powerful and beautifully designed?</p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div>
              <div className="section-tag">Our Mission</div>
              <h2 style={{marginTop:12, marginBottom:20}}>Tech That Works as Hard as You Do</h2>
              <p style={{color:'var(--mid)', lineHeight:1.8, marginBottom:16}}>
                Founded in 2019, Pathnel Tech started in a garage with one goal: make premium tech gear accessible to everyone. We were tired of choosing between expensive gear from big brands and cheap alternatives that broke after a month.
              </p>
              <p style={{color:'var(--mid)', lineHeight:1.8, marginBottom:16}}>
                Every product we carry has been tested by our team of tech enthusiasts, engineers, and everyday users. If it doesn't meet our standards, it doesn't make the cut — simple as that.
              </p>
              <p style={{color:'var(--mid)', lineHeight:1.8}}>
                Today, we serve over 50,000 customers in 30+ countries, and we're just getting started. Our mission remains the same: bring you the gear that makes your work, creative projects, and adventures better.
              </p>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" alt="Office" style={{borderRadius:16, width:'100%'}} />
              <div className="stat-grid">
                {[['50K+', 'Happy Customers'], ['30+', 'Countries Served'], ['200+', 'Products Curated'], ['4.8★', 'Average Rating']].map(([num, label]) => (
                  <div key={label} className="stat-card">
                    <div className="number">{num}</div>
                    <div className="label">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{background:'var(--light)'}}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Our Values</div>
            <h2>What Drives Us Every Day</h2>
          </div>
          <div className="values-grid">
            {[
              { icon: '🎯', title: 'Quality First', desc: 'Every product is rigorously tested. We only sell what we\'d use ourselves.' },
              { icon: '💚', title: 'Sustainability', desc: 'Eco-conscious packaging and long-lasting products to reduce waste.' },
              { icon: '🤝', title: 'Customer Love', desc: '24/7 support, hassle-free returns, and a community that has your back.' }
            ].map(v => (
              <div key={v.title} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{textAlign:'center', maxWidth:560, margin:'0 auto'}}>
          <div className="section-tag">Join Us</div>
          <h2 style={{marginTop:12, marginBottom:16}}>Ready to Upgrade Your Setup?</h2>
          <p style={{color:'var(--mid)', marginBottom:28}}>Explore our full catalog and find the perfect gear for your workflow.</p>
          <Link to="/shop" className="btn btn-primary btn-lg">Shop All Products →</Link>
        </div>
      </section>
    </>
  );
}
