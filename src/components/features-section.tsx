"use client";

import React from 'react';

import { motion } from 'framer-motion';

import {
  BentoGrid,
  BentoGridItem,
} from '@/components/ui/bento-grid';
import {
  faChartLine,
  faCreditCard,
  faGlobe,
  faLock,
  faMobile,
  faRobot,
  faRocket,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FeaturesSection = () => {
  const features = [
    {
      title: "Advanced Trading Platform",
      description: "Professional-grade trading tools with real-time analytics, advanced charting, and AI-powered insights.",
      header: <TradingHeader />,
      icon: <FontAwesomeIcon icon={faChartLine} className="h-4 w-4 text-blue-500" />,
      className: "md:col-span-2",
    },
    {
      title: "Bank-Grade Security",
      description: "Military-grade encryption, multi-factor authentication, and cold storage protection.",
      header: <SecurityHeader />,
      icon: <FontAwesomeIcon icon={faShieldAlt} className="h-4 w-4 text-green-500" />,
    },
    {
      title: "Lightning Fast Execution",
      description: "Sub-millisecond trade execution with global infrastructure and optimized routing.",
      header: <SpeedHeader />,
      icon: <FontAwesomeIcon icon={faRocket} className="h-4 w-4 text-purple-500" />,
    },
    {
      title: "Mobile First Design",
      description: "Native mobile apps with full desktop functionality and offline capabilities.",
      header: <MobileHeader />,
      icon: <FontAwesomeIcon icon={faMobile} className="h-4 w-4 text-pink-500" />,
    },
    {
      title: "Global Market Access",
      description: "Trade in 50+ markets worldwide with 24/7 support and local currency options.",
      header: <GlobalHeader />,
      icon: <FontAwesomeIcon icon={faGlobe} className="h-4 w-4 text-cyan-500" />,
      className: "md:col-span-2",
    },
    {
      title: "Smart Cards & Wallets",
      description: "Intelligent payment solutions with cashback rewards and spending analytics.",
      header: <CardHeader />,
      icon: <FontAwesomeIcon icon={faCreditCard} className="h-4 w-4 text-orange-500" />,
    },
    {
      title: "AI-Powered Insights",
      description: "Machine learning algorithms provide personalized investment recommendations.",
      header: <AIHeader />,
      icon: <FontAwesomeIcon icon={faRobot} className="h-4 w-4 text-red-500" />,
    },
  ];
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-4 sm:mb-6 px-2">
            Powerful Features for
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Modern Finance
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Everything you need to manage, grow, and protect your wealth in one comprehensive platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <BentoGrid className="max-w-6xl mx-auto mobile:grid-cols-1 tablet:grid-cols-2">
            {features.map((item, i) => (
              <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                header={item.header}
                icon={item.icon}
                className={`${item.className || ""} mobile:col-span-1 tablet:col-span-1`}
              />
            ))}
          </BentoGrid>
        </motion.div>
      </div>
    </section>
  );
};

const TradingHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 relative overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="grid grid-cols-3 gap-2 opacity-60">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: [20, 40, 20] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            className="w-4 bg-gradient-to-t from-blue-400 to-purple-400 rounded"
          />
        ))}
      </div>
    </div>
  </div>
);

const SecurityHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 relative overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-2 border-green-400 rounded-full border-t-transparent"
      />
      <FontAwesomeIcon icon={faLock} className="absolute text-green-400 text-xl" />
    </div>
  </div>
);

const SpeedHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 relative overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ x: [-20, 20, -20] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-8 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
      />
    </div>
  </div>
);

const MobileHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 relative overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-24 bg-gray-800 rounded-lg border border-pink-400/50 flex flex-col p-1">
        <div className="w-full h-2 bg-pink-400/30 rounded mb-1" />
        <div className="flex-1 bg-pink-400/20 rounded" />
      </div>
    </div>
  </div>
);

const GlobalHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 relative overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border border-cyan-400/50 rounded-full relative"
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 45}deg) translateY(-32px)`,
            }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
          />
        ))}
      </motion.div>
    </div>
  </div>
);

const CardHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 relative overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-20 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg relative">
        <div className="absolute top-2 left-2 w-4 h-3 bg-yellow-300 rounded-sm" />
        <div className="absolute bottom-2 right-2 text-xs text-black font-mono">****</div>
      </div>
    </div>
  </div>
);

const AIHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 relative overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <FontAwesomeIcon icon={faRobot} className="text-red-400 text-2xl" />
      </motion.div>
    </div>
  </div>
);

export default FeaturesSection;
