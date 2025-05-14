import React from 'react';

const FooterSection = () => {
  return (
    <footer className="footer">
      {/* Main footer content */}
      <div className="footer-top">
        {/* Column 1: About Fundme */}
        <div className="footer-column">
          <h4>Fundme</h4>
          <ul>
            <li>How it works</li>
            <li>Discover</li>
            <li>Campaigns</li>
            <li>Resources</li>
          </ul>
        </div>
        {/* Column 2: Ways to give */}
        <div className="footer-column">
          <h4>Ways to give</h4>
          <ul>
            <li>Discover</li>
            <li>Suggested Gift</li>
            <li>Tools</li>
            <li>Friday donors</li>
          </ul>
        </div>
        {/* Column 3: About Fundme */}
        <div className="footer-column">
          <h4>About Fundme</h4>
          <ul>
            <li>About us</li>
            <li>Customer Service</li>
            <li>Contact us</li>
            <li>Safety &amp; Compliance</li>
            <li>Support team</li>
          </ul>
        </div>
        {/* Column 4: Campaign & Newsletter */}
        <div className="footer-column newsletter">
          <h4>Campaign</h4>
          <ul>
            <li>Online campaign</li>
            <li>FAQ</li>
          </ul>
          {/* Newsletter Signup */}
          <div className="newsletter-signup">
            <input
              type="email"
              placeholder="Stay connected, join our newsletter"
              className="email-input"
            />
            <button className="subscribe-button">Subscribe</button>
          </div>
        </div>
      </div>
      
      {/* Footer bottom */}
      <div className="footer-bottom">
        <div>&copy; Fundme Limited 2024. All rights reserved.</div>
        {/* Social icons (just placeholders here) */}
        <div className="social-icons">
          <a href="#">FB</a>
          <a href="#">TW</a>
          <a href="#">IG</a>
        </div>
      </div>
      
      {/* Styles */}
      <style jsx>{`
        .footer {
          background-color: #005F73;
          color: #fff;
          padding: 40px 20px;
          font-family: Arial, sans-serif;
        }
        .footer-top {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .footer-column h4 {
          margin-bottom: 10px;
          font-size: 1.1rem;
        }
        .footer-column ul {
          list-style: none;
          padding: 0;
        }
        .footer-column li {
          margin-bottom: 8px;
          font-size: 0.95rem;
        }
        /* Newsletter input & button styling */
        .newsletter-signup {
          margin-top: 10px;
        }
        .email-input {
          width: 100%;
          padding: 8px 10px;
          border: none;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        .subscribe-button {
          background-color: #0A9396;
          color: #fff;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
        }
        .subscribe-button:hover {
          background-color: #94D2BD;
        }
        /* Footer bottom styling */
        .footer-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          border-top: 1px solid #ccc;
          padding-top: 15px;
          font-size: 0.9rem;
        }
        .social-icons {
          margin-top: 10px;
        }
        .social-icons a {
          margin: 0 8px;
          color: #fff;
          text-decoration: none;
          font-weight: bold;
        }
        @media(min-width: 768px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
          }
        }
      `}</style>
    </footer>
  );
    }
 export default FooterSection;   