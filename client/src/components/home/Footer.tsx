import React from 'react'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'
import logoWM from '../../assets/logoWMnew-Photoroom.jpg'

const Footer = () => {
  return (
    <>
          <footer className="bg-white py-16 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
              <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                      {/* Logo and Copyright Section */}
                      <div className="lg:col-span-1">
                          <div className="flex items-center gap-2 mb-4">
                              <img src={logoWM} alt="WorkMate Logo" className="h-8 w-auto" />
                              <span className="text-xl font-bold text-customBlack">WorkMate</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                              All Rights Reserved © workmate.com
                          </p>
                          <div className="mb-6">
                              <h3 className="font-semibold text-customBlack mb-2">Address</h3>
                              <p className="text-sm text-gray-600">
                                  Chitkara University, Baddi, Himachal Pradesh
                              </p>
                          </div>
                          <div>
                              <h3 className="font-semibold text-customBlack mb-2">Social Media</h3>
                              <div className="flex gap-4">
                                  <a href="#" className="text-gray-600 hover:text-customBlue">
                                      <FaFacebook size={20} />
                                  </a>
                                  <a href="#" className="text-white bg-gray-600 rounded-md hover:bg-pink-600">
                                      <FaInstagram size={20} />
                                  </a>
                                  <a href="#" className="text-gray-600 hover:text-customBlue">
                                      <FaTwitter size={20} />
                                  </a>
                                  <a href="#" className="text-gray-600 hover:text-red-600">
                                      <FaYoutube size={20} />
                                  </a>
                              </div>
                          </div>
                      </div>

                      {/* Product Section */}
                      <div className="lg:col-span-1">
                          <h2 className="text-lg font-semibold text-customBlack mb-4">Product</h2>
                          <ul className="space-y-2">
                              <li><a href="#" className="text-gray-600 hover:text-customBlue">Product</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue">Developers</a></li>
                          </ul>
                      </div>

                      {/* Team Section */}
                      <div className="lg:col-span-1">
                          <h2 className="text-lg font-semibold text-customBlack mb-4">Team</h2>
                          <ul className="space-y-2">
                              <li><a href="#" className="text-gray-600 hover:text-customBlue">About Us</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue">Contact Us</a></li>
                          </ul>
                      </div>

                      {/* Solutions Section */}
                      <div className="lg:col-span-1">
                          <h2 className="text-lg font-semibold text-customBlack mb-4">Solutions</h2>
                          <ul className="space-y-2">
                              <li><a href="#" className="text-gray-600 hover:text-customBlue">Project Management</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue">Marketing</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue">Creative Production</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue">Remote Work</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue">HR</a></li>
                          </ul>
                      </div>

                      {/* Resources Section */}
                      <div className="lg:col-span-1">
                          <h2 className="text-lg font-semibold text-customBlack mb-4">Resources</h2>
                          <ul className="space-y-2">
                              <li><a href="#" className="text-gray-600 hover:text-customBlue">Knowledge Base</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue">Daily Webinars</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue">Community</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue">Customer Stories</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue">Templates</a></li>
                          </ul>
                      </div>
                  </div>
              </div>
          </footer>
      </>
  )
}

export default Footer