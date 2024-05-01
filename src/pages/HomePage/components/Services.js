import React from 'react';
import icons1 from '../../images/icons1.png'; // Importing image
import icons2 from '../../images/icons5.png'; // Importing image
import icons3 from '../../images/icons3.png'; // Importing image
import icons4 from '../../images/icons4.png'; // Importing image


const Services = () => {
    return(
      <div className="services">
        <div className="services-wrapper">
          <div className="services-text">
            <h1>Our Services</h1>
            <p>Discover our comprehensive services designed to support your mental health journey,</p>
            <p>including counseling, therapy, medication management, and holistic wellness programs.</p>
          </div>
          <div className="services-bottom">
            
            <div className="services-info">
              <div className='icon'>
                <img src={icons1} alt="icon"/>
              </div>
              <h2>Medical Divices</h2>
              <p>Explore cutting-edge devices for better care.</p>
            </div>
            <div className="services-info">
              <div className='icon'>
                <img src={icons2} alt="icon"/>
              </div>
              <h2>Medicines</h2>
              <p>Discover our carefully curated medicines for your well-being.</p>
            </div>
            <div className="services-info">
              <div className='icon'>
                <img src={icons3} alt="icon"/>
              </div>
              <h2>Vaccines</h2>
              <p>Discover our diverse vaccines, protecting health for all.</p>
            </div>
            <div className="services-info">
              <div className='icon'>
                <img src={icons4} alt="icon"/>
              </div>
              <h2>Services</h2>
              <p>"Experience our exceptional service firsthand."</p>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Services;