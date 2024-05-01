import React from 'react';
import doctor1 from '../../images/doctor1.png'; // Importing image
import doctor2 from '../../images/doctor7.jpg'; // Importing image
import doctor3 from '../../images/doctor8.png'; // Importing image


const Services = () => {
    return(
        <div className="doctors">
          <div className='doctors-text'>
            <h1>Top doctor from the world</h1>
            <p>Meet our renowned team of world-class doctors dedicated to providing exceptional care and expertise.</p>
          </div>
          <div className='doctors-image'>
            <div className='doctors-image-doctor'>
              <img src={doctor1} alt="doctor"/>
              <p>Dr. John Doe</p>
              <button>Book Now</button>
            </div>
            <div className='doctors-image-doctor'>
              <img src={doctor2} alt="doctor"/>
              <p>Dr. Anthony Fauci</p>
              <button>Book Now</button>
            </div>
            <div className='doctors-image-doctor'>
              <img src={doctor3} alt="doctor"/>
              <p>Dr. Sanjay Gupta</p>
              <button>Book Now</button>
            </div>
          </div>
        </div>
    );
};

export default Services;