import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  function handle(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }

  function submit(e) {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><a href="/">Home</a> › <span>Contact</span></div>
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Our team typically responds within 24 hours.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>How Can We Help?</h2>
              <p>Whether you have a question about a product, need help with an order, or just want to say hello — we're here.</p>

              {[
                { icon: '📧', title: 'Email Support', value: 'support@pathneltech.com', sub: 'Responses within 24 hours' },
                { icon: '📞', title: 'Phone Support', value: '+1 (800) 555-0199', sub: 'Mon–Fri, 9am–6pm EST' },
                { icon: '📍', title: 'Headquarters', value: '100 Tech Avenue, Suite 400', sub: 'San Francisco, CA 94102' }
              ].map(d => (
                <div key={d.title} className="contact-detail">
                  <div className="contact-detail-icon">{d.icon}</div>
                  <div className="contact-detail-text">
                    <strong>{d.title}</strong>
                    <span>{d.value}</span>
                    <span style={{fontSize:12, color:'var(--mid)'}}>{d.sub}</span>
                  </div>
                </div>
              ))}

              <div style={{marginTop:32, padding:24, background:'var(--green-light)', borderRadius:12}}>
                <h4 style={{color:'var(--green-dark)', marginBottom:8}}>🕐 Support Hours</h4>
                <p style={{fontSize:14, color:'var(--green-dark)', lineHeight:1.8}}>
                  Monday – Friday: 9:00 AM – 6:00 PM EST<br />
                  Saturday: 10:00 AM – 4:00 PM EST<br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            <div>
              {sent ? (
                <div style={{background:'var(--light)', borderRadius:16, padding:48, textAlign:'center'}}>
                  <div style={{fontSize:56, marginBottom:16}}>✅</div>
                  <h2>Message Sent!</h2>
                  <p style={{color:'var(--mid)', marginTop:8, marginBottom:24}}>We'll get back to you within 24 hours.</p>
                  <button className="btn btn-primary" onClick={() => setSent(false)}>Send Another Message</button>
                </div>
              ) : (
                <div className="checkout-form">
                  <h2>Send a Message</h2>
                  <form onSubmit={submit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Your Name *</label>
                        <input className="form-input" name="name" value={form.name} onChange={handle} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input className="form-input" type="email" name="email" value={form.email} onChange={handle} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject *</label>
                      <select className="form-input" name="subject" value={form.subject} onChange={handle} required>
                        <option value="">Select a subject...</option>
                        <option>Order Issue</option>
                        <option>Product Question</option>
                        <option>Return & Refund</option>
                        <option>Shipping Inquiry</option>
                        <option>Technical Support</option>
                        <option>Partnership</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message *</label>
                      <textarea className="form-input" name="message" value={form.message} onChange={handle} rows={6} required placeholder="Describe your question or issue in detail..." style={{resize:'vertical'}} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full btn-lg">Send Message →</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
