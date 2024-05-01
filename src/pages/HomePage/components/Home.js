import React from 'react';
import pickture1 from '../../images/bg1.png'; // Importing image


const Home = () => {
    return(
        <div className="home">
          <img src={pickture1} alt="home"/>
          <div className="home-text">
            <h2>We Will Help To Improve Your Mental Health </h2>
            <p>Our hospital is committed to providing comprehensive and professional healthcare services to support the improvement of mental health in the community. We offer not only traditional therapies but also advanced methods and multidimensional support programs to help individuals achieve optimal mental and emotional well-being.</p>
          </div>
        </div>
    );
};

export default Home;