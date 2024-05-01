import React from 'react';
import logo from '../../images/logo.png'; // Importing image
import face from '../../images/facebook.png'; // Importing image
import inta from '../../images/instagram.png'; // Importing image
import x from '../../images/x.png'; // Importing image
import youtube from '../../images/youtube.png'; // Importing image
import { Link } from 'react-router-dom/cjs/react-router-dom.min';


const Footer = () => {

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementsByClassName(sectionId)[0]; // Get the section by class name
    if (section) {
        window.scrollTo({
            top: section.offsetTop,
            behavior: 'smooth' // Scroll smoothly to the section
        });
    }
};

    return (
      <div className="footer">
        <div className="footer-wrapper">
          <div className="footer-section-one">
            <h2 className='logo'>HCMUT</h2>
            <div className="footer-icons">
              <img src={face} alt="" />
              <img src={inta} alt="" />
              <img src={x} alt="" />
              <img src={youtube} alt="" />
            </div>
          </div>
          <div className="footer-section-two">
            <div className="footer-section-columns">
              <h2>Quick Link</h2>
              <span  onClick={() => handleScrollToSection("home")}>Home</span>
              <span  onClick={() => handleScrollToSection("services")}>Services</span>
              <span  onClick={() => handleScrollToSection("about")}>About</span>
              <span  onClick={() => handleScrollToSection("doctors")}>Doctors</span>
            </div>
            <div className="footer-section-columns">
              <h2>Contact Us</h2>
              <span>244-5333-7783</span>
              <span>hello@hospital.com</span>
              <span>press@hospital.com</span>
              <span>contact@hospital.com</span>
            </div>
            <div className="footer-section-columns">
              <h2>Legal</h2>
              <span>Terms & Conditions</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        </div>
        <div className='footer-section-three'>
            <hr />
            <p>© 2021 Food, All Rights Reserved.</p>
          </div>
      </div>
    );
};

export default Footer;