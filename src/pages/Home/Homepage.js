import React, { useEffect } from 'react';
import Header from '../../components/Header/Header';
import './Homepage.css';
import Hero from '../../assets/Hero/Hero';
import Portfolio from '../../assets/landing page/landingpage';
// import Dashboard from '../../assets/Dashboard/Dashboard';

function HomePage() {

  return (
    <div className="app">
     {/* <Hero/> */}
     {/* <Dashboard/> */}
     <Portfolio/>
    </div>
  );
}

export default HomePage;
