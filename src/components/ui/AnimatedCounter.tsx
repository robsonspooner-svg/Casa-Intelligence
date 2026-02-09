'use client';

import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  const display = useTransform(spring, (current) => {
    if (target >= 1000) {
      return `${prefix}${Math.round(current).toLocaleString()}${suffix}`;
    }
    return `${prefix}${Math.round(current * 10) / 10}${suffix}`;
  });

  useEffect(() => {
    if (isInView) {
      spring.set(target);
    }
  }, [isInView, spring, target]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
