// src/components/ui/Button.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, type = "button", className = "", disabled = false, fullWidth = false }) => {
  const baseClasses = "font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500";
  const fullClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md active:scale-95";

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${fullClass} ${disabledClass} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;