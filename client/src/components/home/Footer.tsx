import React from 'react'
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from "react-icons/fa6";
import logoWM from '../../assets/logoWMnew-Photoroom.png'

const Footer = () => {
  return (
    <>
          <footer className="bg-white py-16 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 dark:bg-[#242424]">
              <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                      {/* Logo and Copyright Section */}
                      <div className="lg:col-span-1">
                          <div className="flex items-center gap-2 mb-4">
                              <img src={logoWM} alt="WorkMate Logo" className="h-8 w-auto" />
                              <span className="text-xl font-bold text-customBlack dark:text-amber-50">WorkMate</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-4 dark:text-gray-300">
                              All Rights Reserved © workmate.com
                          </p>
                          <div className="mb-6">
                              <h3 className="font-semibold text-customBlack mb-2 dark:text-amber-50">Address</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                  Chitkara University, Baddi, Himachal Pradesh
                              </p>
                          </div>
                          <div>
                              <h3 className="font-semibold text-customBlack mb-2 dark:text-amber-50">Social Media</h3>
                              <div className="flex gap-4">
                                  <a href="#" className="text-gray-600 hover:text-customBlue dark:text-customBlue">
                                      <FaFacebook size={20} />
                                  </a>
                                  <a href="#" className="text-white bg-gray-600 rounded-md hover:bg-pink-600 dark:bg-pink-600 dark:text-amber-50">
                                      <FaInstagram size={20} />
                                  </a>
                                  <a href="#" className="text-gray-600 hover:text-customBlue dark:text-amber-50">
                                      <FaXTwitter size={20} />
                                  </a>
                                  <a href="#" className="text-gray-600 hover:text-red-600 dark:text-red-600">
                                      <FaYoutube size={20} />
                                  </a>
                              </div>
                          </div>
                      </div>

                      {/* Product Section */}
                      <div className="lg:col-span-1">
                          <h2 className="text-lg font-semibold text-customBlack mb-4 dark:text-amber-50">Product</h2>
                          <ul className="space-y-2">
                              <li><a href="#" className="text-gray-600 hover:text-customBlue dark:text-gray-300">Product</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue dark:text-gray-300">Developers</a></li>
                          </ul>
                      </div>

                      {/* Team Section */}
                      <div className="lg:col-span-1">
                          <h2 className="text-lg font-semibold text-customBlack mb-4 dark:text-amber-50">Team</h2>
                          <ul className="space-y-2">
                              <li><a href="#" className="text-gray-600 hover:text-customBlue dark:text-gray-300">About Us</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue dark:text-gray-300">Contact Us</a></li>
                          </ul>
                      </div>

                      {/* Solutions Section */}
                      <div className="lg:col-span-1">
                          <h2 className="text-lg font-semibold text-customBlack mb-4 dark:text-amber-50">Solutions</h2>
                          <ul className="space-y-2">
                              <li><a href="#" className="text-gray-600 hover:text-customBlue dark:text-gray-300">Project Management</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue dark:text-gray-300">Marketing</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue dark:text-gray-300">Creative Production</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue dark:text-gray-300">Remote Work</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue dark:text-gray-300">HR</a></li>
                          </ul>
                      </div>

                      {/* Resources Section */}
                      <div className="lg:col-span-1">
                          <h2 className="text-lg font-semibold text-customBlack mb-4 dark:text-amber-50">Resources</h2>
                          <ul className="space-y-2">
                              <li><a href="#" className="text-gray-600 hover:text-customBlue dark:text-gray-300">Knowledge Base</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue dark:text-gray-300">Daily Webinars</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue dark:text-gray-300">Community</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue dark:text-gray-300">Customer Stories</a></li>
                              <li><a href="#" className="text-gray-600 hover:text-customBlue dark:text-gray-300">Templates</a></li>
                          </ul>
                      </div>
                  </div>
              </div>
          </footer>
      </>
  )
}

export default Footer