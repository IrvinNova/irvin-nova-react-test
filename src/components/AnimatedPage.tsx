import { motion } from "framer-motion";
import React from "react";

interface AnimatedPageProps {
    children: React.ReactNode;
}

const animations = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

export default function AnimatedPage({ children }: AnimatedPageProps) {
    return (
        <motion.div
            variants={animations}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
}
