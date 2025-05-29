"use client";

import React from 'react';

import { motion } from 'framer-motion';

import {
  faDiscord,
  faGithub,
  faLinkedin,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import {
  faArrowUp,
  faChartLine,
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    Platform: [
      { name: "Trading", href: "#trading" },
      { name: "Investment", href: "#investment" },
      { name: "Banking", href: "#banking" },
      { name: "API Access", href: "#api" },
    ],
    Company: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "#careers" },
      { name: "Press", href: "#press" },
      { name: "Contact", href: "#contact" },
    ],
    Resources: [
      { name: "Documentation", href: "#docs" },
      { name: "Help Center", href: "#help" },
      { name: "Blog", href: "#blog" },
      { name: "Community", href: "#community" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Compliance", href: "#compliance" },
      { name: "Security", href: "#security" },
    ],
  };

  const socialLinks = [
    { icon: faTwitter, href: "#", label: "Twitter" },
    { icon: faLinkedin, href: "#", label: "LinkedIn" },
    { icon: faGithub, href: "#", label: "GitHub" },
    { icon: faDiscord, href: "#", label: "Discord" },
  ];
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-6">
            {/* Company Info */}
            <div className="sm:col-span-2 lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faChartLine} className="text-white text-sm" />
                  </div>
                  <span className="font-display font-bold text-xl text-white">
                    FinTech Pro
                  </span>
                </div>
                <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  The most advanced financial platform for modern investors. 
                  Trade, invest, and manage your wealth with institutional-grade tools and security.
                </p>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-400 w-4 h-4" />
                    <span>San Francisco, CA 94105</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <FontAwesomeIcon icon={faPhone} className="text-blue-400 w-4 h-4" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <FontAwesomeIcon icon={faEnvelope} className="text-blue-400 w-4 h-4" />
                    <span>support@fintechpro.com</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="sm:col-span-1"
              >
                <h3 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">{category}</h3>
                <ul className="space-y-2 sm:space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white active:text-blue-400 transition-colors duration-200 text-xs sm:text-sm touch:min-h-[44px] touch:flex touch:items-center"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-8 border-t border-white/10"
        >
          <div className="max-w-md mx-auto text-center lg:text-left lg:max-w-none lg:flex lg:items-center lg:justify-between">
            <div className="lg:flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-gray-400 text-sm">
                Get the latest market insights and platform updates delivered to your inbox.
              </p>
            </div>
            <div className="mt-6 lg:mt-0 lg:flex-shrink-0">
              <div className="flex max-w-md mx-auto lg:mx-0">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-r-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-gray-400 text-sm mb-4 md:mb-0"
            >
              © 2025 FinTech Pro. All rights reserved. | Licensed and regulated financial services.
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4"
            >
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-200"
                >
                  <FontAwesomeIcon icon={social.icon} />
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </motion.button>
    </footer>
  );
};

export default Footer;
