import React from 'react'
import NavBar from '../components/home/NavBar'
import Hero from '../components/home/Hero';
import Features from '../components/home/Features'
import illustration from '../assets/business-illustration.png';
import teamboost from '../assets/boost productivity.png';
import { ClipboardCheck, FolderOutput, ListTodo, MessagesSquare, SquareKanban } from 'lucide-react';
import Overview from '../components/home/Overview';
import Collaborate from '../components/home/Collaborate';
import Productivity from '../components/home/Productivity';


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



    </div>
  )
}

export default Home