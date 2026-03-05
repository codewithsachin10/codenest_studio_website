import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            setIsVisible(latest > 0.02);
        });
        return () => unsubscribe();
    }, [scrollYProgress]);

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-primary via-primary/80 to-accent"
            style={{ scaleX }}
        />
    );
}
