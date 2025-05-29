"use client";

import React, {
  useEffect,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import { cn } from '@/lib/utils';
import {
  faBars,
  faChartLine,
  faCreditCard,
  faShieldAlt,
  faTimes,
  faUniversity,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Trading", href: "#trading", icon: faChartLine },
    { name: "Wallet", href: "#wallet", icon: faWallet },
    { name: "Cards", href: "#cards", icon: faCreditCard },
    { name: "Banking", href: "#banking", icon: faUniversity },
    { name: "Security", href: "#security", icon: faShieldAlt },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-black/80 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faChartLine} className="text-white text-sm" />
            </div>
            <span className="font-display font-bold text-xl text-white">
              FinTech Pro
            </span>
          </motion.div>          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 group touch:min-h-[44px] touch:min-w-[44px] touch:flex touch:items-center touch:justify-center"
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="text-sm group-hover:text-blue-400 transition-colors"
                />
                <span className="font-medium text-sm xl:text-base">{item.name}</span>
              </motion.a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-3 py-2 xl:px-4 xl:py-2 text-sm xl:text-base text-gray-300 hover:text-white transition-colors touch:min-h-[44px] touch:min-w-[44px]"
            >
              Sign In
            </motion.button>            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="px-4 py-2 xl:px-6 xl:py-2 text-sm xl:text-base bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium touch:min-h-[44px] touch:min-w-[44px]"
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-3 touch:min-h-[44px] touch:min-w-[44px] flex items-center justify-center"
            aria-label="Toggle mobile menu"
            aria-expanded={isOpen}
          >
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-lg" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-md border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2 safe-area-inset-bottom">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white active:text-blue-400 transition-colors py-3 px-2 rounded-lg hover:bg-white/5 active:bg-white/10 min-h-[44px] touch:min-h-[48px]"
                >
                  <FontAwesomeIcon icon={item.icon} className="text-blue-400 w-5 h-5" />
                  <span className="text-base font-medium">{item.name}</span>
                </motion.a>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <button className="w-full text-left text-gray-300 hover:text-white active:text-blue-400 transition-colors py-3 px-2 rounded-lg hover:bg-white/5 min-h-[44px] text-base font-medium">
                  Sign In
                </button>
                <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium text-base hover:from-blue-600 hover:to-purple-700 active:scale-98 transition-all duration-200 min-h-[48px] touch:min-h-[52px]">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
