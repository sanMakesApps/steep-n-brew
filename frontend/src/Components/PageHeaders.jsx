import React from "react";
import { motion } from "framer-motion";

const PageHeaders = ({ pageHeader }) => {
  return (
    <motion.h1
      className="mt-5 text-3xl sm:text-4xl font-bold mb-5 text-gray-200 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {pageHeader}
    </motion.h1>
  );
};

export default PageHeaders;
