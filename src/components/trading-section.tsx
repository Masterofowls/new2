"use client";

import React from 'react';

import { motion } from 'framer-motion';

import {
  Card,
  Carousel,
} from '@/components/ui/apple-cards-carousel';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';
import {
  faChartLine,
  faGem,
  faGlobe,
  faLandmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TradingSection = () => {  const tradingCardsData = [
    {
      category: "Cryptocurrency",
      title: "Digital Asset Trading",
      src: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      content: <CryptoContent />,
    },
    {
      category: "Stocks & ETFs", 
      title: "Global Equity Markets",
      src: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      content: <StocksContent />,
    },
    {
      category: "Commodities",
      title: "Precious Metals & Energy",
      src: "https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      content: <CommoditiesContent />,
    },
    {
      category: "Forex",
      title: "Currency Exchange",
      src: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      content: <ForexContent />,
    },
    {
      category: "Bonds",
      title: "Fixed Income Securities",
      src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      content: <BondsContent />,
    },
  ];

  const tradingCards = tradingCardsData.map((card, index) => (
    <Card key={index} card={card} index={index} />
  ));
  return (
    <section id="trading" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-4 sm:mb-6 px-2">
            Trade Everything
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              From One Platform
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Access global markets with professional-grade tools, real-time data, and institutional-level execution.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="overflow-hidden"
        >
          <Carousel items={tradingCards} />
        </motion.div>
      </div>
    </section>
  );
};

const CryptoContent = () => (
  <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
    <div className="flex items-center mb-6">
      <FontAwesomeIcon icon={faBitcoin} className="text-orange-500 text-3xl mr-4" />
      <div>
        <p className="text-neutral-600 dark:text-neutral-400 text-base font-normal">
          Cryptocurrency Trading
        </p>
        <p className="text-black dark:text-white text-xl font-semibold">
          Digital Asset Exchange
        </p>
      </div>
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <span className="font-medium">Bitcoin (BTC)</span>
        <span className="text-green-500 font-semibold">$67,234 +2.4%</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <span className="font-medium">Ethereum (ETH)</span>
        <span className="text-green-500 font-semibold">$3,456 +3.1%</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <span className="font-medium">Solana (SOL)</span>
        <span className="text-red-500 font-semibold">$198 -1.2%</span>
      </div>
    </div>
    <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-6">
      Trade 200+ cryptocurrencies with zero fees, advanced charting, and institutional-grade security.
    </p>
  </div>
);

const StocksContent = () => (
  <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
    <div className="flex items-center mb-6">
      <FontAwesomeIcon icon={faChartLine} className="text-blue-500 text-3xl mr-4" />
      <div>
        <p className="text-neutral-600 dark:text-neutral-400 text-base font-normal">
          Global Equities
        </p>
        <p className="text-black dark:text-white text-xl font-semibold">
          Stocks & ETFs
        </p>
      </div>
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <span className="font-medium">AAPL</span>
        <span className="text-green-500 font-semibold">$175.43 +1.8%</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <span className="font-medium">TSLA</span>
        <span className="text-green-500 font-semibold">$248.87 +4.2%</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <span className="font-medium">SPY</span>
        <span className="text-green-500 font-semibold">$456.78 +0.9%</span>
      </div>
    </div>
    <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-6">
      Access 50+ global markets with fractional shares, real-time quotes, and advanced analytics.
    </p>
  </div>
);

const CommoditiesContent = () => (
  <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
    <div className="flex items-center mb-6">
      <FontAwesomeIcon icon={faGem} className="text-yellow-500 text-3xl mr-4" />
      <div>
        <p className="text-neutral-600 dark:text-neutral-400 text-base font-normal">
          Commodities Trading
        </p>
        <p className="text-black dark:text-white text-xl font-semibold">
          Precious Metals & Energy
        </p>
      </div>
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <span className="font-medium">Gold</span>
        <span className="text-green-500 font-semibold">$2,034/oz +0.8%</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <span className="font-medium">Silver</span>
        <span className="text-green-500 font-semibold">$24.67/oz +1.5%</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <span className="font-medium">Crude Oil</span>
        <span className="text-red-500 font-semibold">$78.45/bbl -2.1%</span>
      </div>
    </div>
    <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-6">
      Trade commodities with competitive spreads, real-time pricing, and global market access.
    </p>
  </div>
);

const ForexContent = () => (
  <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
    <div className="flex items-center mb-6">
      <FontAwesomeIcon icon={faGlobe} className="text-green-500 text-3xl mr-4" />
      <div>
        <p className="text-neutral-600 dark:text-neutral-400 text-base font-normal">
          Foreign Exchange
        </p>
        <p className="text-black dark:text-white text-xl font-semibold">
          Currency Trading
        </p>
      </div>
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <span className="font-medium">EUR/USD</span>
        <span className="text-green-500 font-semibold">1.0876 +0.3%</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <span className="font-medium">GBP/USD</span>
        <span className="text-red-500 font-semibold">1.2634 -0.2%</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <span className="font-medium">USD/JPY</span>
        <span className="text-green-500 font-semibold">148.76 +0.8%</span>
      </div>
    </div>
    <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-6">
      Trade major, minor, and exotic currency pairs with institutional spreads and 24/5 execution.
    </p>
  </div>
);

const BondsContent = () => (
  <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
    <div className="flex items-center mb-6">
      <FontAwesomeIcon icon={faLandmark} className="text-purple-500 text-3xl mr-4" />
      <div>
        <p className="text-neutral-600 dark:text-neutral-400 text-base font-normal">
          Fixed Income
        </p>
        <p className="text-black dark:text-white text-xl font-semibold">
          Government & Corporate Bonds
        </p>
      </div>
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <span className="font-medium">US 10Y Treasury</span>
        <span className="text-red-500 font-semibold">4.23% -0.05</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <span className="font-medium">German Bund 10Y</span>
        <span className="text-green-500 font-semibold">2.45% +0.02</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-700 rounded-lg">
        <span className="font-medium">Corporate AAA</span>
        <span className="text-green-500 font-semibold">5.12% +0.08</span>
      </div>
    </div>
    <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-6">
      Build stable income streams with government and corporate bonds, with transparent pricing and yield analytics.
    </p>
  </div>
);

export default TradingSection;
