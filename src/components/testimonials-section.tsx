"use client";

import React from 'react';

import { motion } from 'framer-motion';

import { AnimatedTestimonials } from '@/components/ui/animated-testimonials';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "FinTech Pro has completely transformed how I manage my investments. The AI-powered insights have helped me increase my portfolio returns by 35% in just 6 months.",
      name: "Sarah Chen",
      designation: "Investment Manager at Goldman Sachs",
      src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The security features are unparalleled. As a cybersecurity expert, I can confidently say this platform sets the gold standard for financial security.",
      name: "Michael Rodriguez",
      designation: "Chief Security Officer at Meta",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The mobile experience is seamless. I can trade on-the-go with the same professional tools I use on desktop. It's like having a trading floor in my pocket.",
      name: "Emily Johnson",
      designation: "Senior Trader at JPMorgan Chase",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Customer support is exceptional. 24/7 availability with knowledgeable staff who understand complex trading scenarios. They've saved me from costly mistakes multiple times.",
      name: "David Park",
      designation: "Portfolio Manager at BlackRock",
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The analytics dashboard provides insights I never had before. Risk management tools are sophisticated yet easy to use. This platform has elevated my entire trading strategy.",
      name: "Lisa Wang",
      designation: "Quantitative Analyst at Citadel",
      src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-4 sm:mb-6 px-2">
            Trusted by
            <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Financial Professionals
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            See why leading financial institutions and professionals choose FinTech Pro for their trading and investment needs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <AnimatedTestimonials testimonials={testimonials} />
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 text-sm mb-8 font-medium">
            TRUSTED BY LEADING FINANCIAL INSTITUTIONS
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {["Goldman Sachs", "JPMorgan", "BlackRock", "Citadel", "Meta", "Stripe"].map((company) => (
              <div key={company} className="text-gray-500 font-semibold text-lg">
                {company}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
