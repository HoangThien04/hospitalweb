import React from 'react';
import './HomePage.css'; // Importing CSS file
import Home from './components/Home'; // Importing component
import Doctors from './components/Doctors'; // Importing component
import About from './components/About'; // Importing component  
import Navbar from './components/Navbar'; // Importing component
import Footer from './components/Footer'; // Importing component
import Services from './components/Services';



function HomePage() {  
  return (
    
    <div className="home-page-container">
      <Navbar />
      <Home />
      <Services />
      <About />
      <Doctors />
      <Footer />
    </div>
  );
}

export default HomePage;
