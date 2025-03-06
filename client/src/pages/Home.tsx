import React from 'react'
import NavBar from '../components/home/NavBar'
import Hero from '../components/home/Hero';
import Features from '../components/home/Features'
import Overview from '../components/home/Overview';
import Collaborate from '../components/home/Collaborate';
import Productivity from '../components/home/Productivity';
import Footer from '../components/home/Footer';


const Home = () => {
  return (
    <div className='font-nunito min-h-screen bg-white'>

      <NavBar /> 

      <Hero/>

      {/* This is the Features Section "What you can do?" */}

      <Features/>

      {/*Our Features Section*/}

      <Overview/>


      {/*Start collaborating Instantly Section */}

      <Collaborate/>


      {/*Boost team Productivity*/}

      <Productivity/>

      {/*Footer Section*/}\

      <Footer/>



    </div>
  )
}

export default Home