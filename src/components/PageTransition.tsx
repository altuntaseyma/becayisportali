import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    x: -20
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
};

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition; 