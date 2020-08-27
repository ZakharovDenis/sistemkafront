import React from 'react';
import './styles/Homepage.css'
import Navbar from './components/Navbar'
import PhotoWindow from './components/PhotoWindow'
import LoadScreen from './components/LoadScreen'
import TryItOut from './components/TryItOut'
import Partners from './components/Partners'
import Contact from './components/Contact'
import Footer from './components/Footer'

function Homepage() {
  return (
    <>
      <header>
      <Navbar/>
      </header>
      <div className='homepage'>
      <PhotoWindow/>
      <TryItOut/>
      {/* <Partners/> */}
      {/* <Contact/> */}
      {/* <Footer/> */}
      </div>
      <LoadScreen/>
    </>
  );
}

export default Homepage;
