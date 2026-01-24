import { motion, Variants } from 'framer-motion';

interface ScrollAnimationProps {
    children: React.ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    delay?: number;
    className?: string;
    duration?: number;
    viewport?: { once?: boolean; margin?: string; amount?: number | "some" | "all" };
}

export const ScrollAnimation = ({
    children,
    direction = 'up',
    delay = 0,
    className = "",
    duration = 0.5,
    viewport = { once: false, margin: "-50px", amount: 0.3 }
}: ScrollAnimationProps) => {

    const getVariants = (): Variants => {
        const distance = 50;

        const hidden: any = { opacity: 0 };
        if (direction === 'up') hidden.y = distance;
        if (direction === 'down') hidden.y = -distance;
        if (direction === 'left') hidden.x = distance;
        if (direction === 'right') hidden.x = -distance;

        return {
            hidden,
            visible: {
                opacity: 1,
                y: 0,
                x: 0,
                transition: {
                    duration: duration,
                    delay: delay,
                    ease: "easeOut"
                }
            }
        };
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            exit="hidden"
            viewport={viewport}
            variants={getVariants()}
            className={className}
        >
            {children}
        </motion.div>
    );
};
