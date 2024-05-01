import React from 'react';
import { Link } from 'react-router-dom';
import pickture3 from '../../images/doctor3.png'; // Importing image
import tick from '../../images/tick.jpg'; // Importing image
import arrow from '../../images/arrow.png'; // Importing image


const About = () => {
    return (
        <div className="about">
          <img src={pickture3} alt="why"/>
          <div className="about-text">
            <h2>Why Choose Us</h2>
            <div className="about-info">
              <img src={tick} alt="tick"/>
              <p>Our commitment: personalized care and advanced treatments for your well-being.</p>
            </div>
            <div className="about-info">
              <img src={tick} alt="tick"/>
              <p>Our expert team and state-of-the-art technologies ensure top-quality care.</p>
            </div>
            <div className="about-info">
              <img src={tick} alt="tick"/>
              <p>From diagnosis to recovery, we're with you every step of the journey.</p>
            </div>
            <div className="about-info">
              <img src={tick} alt="tick"/>
              <p>Innovation and excellence are at the heart of everything we do.</p>
            </div>
            <div className="about-info">
              <img src={tick} alt="tick"/>
              <p>Trust us for compassionate, dedicated care that puts your health first.</p>
            </div>
          </div>
          
        </div>
    );
};

export default About;