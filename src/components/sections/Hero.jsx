'use client'

import { motion, useAnimationFrame } from 'framer-motion'
import { useTheme } from '../theme-provider'
import Image from 'next/image'
import { ReactTyped } from 'react-typed'
import AnimatedLetters from './AnimatedLetters'
import styles from './Hero.module.css'
import { useRef, useState, useEffect } from 'react'
// Add font imports for calligraphy and code
import { Kalam } from 'next/font/google'
import { Inter, Space_Mono, Fira_Code } from 'next/font/google'

// Initialize the fonts
const calligraphyFont = Kalam({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-calligraphy'
})

const interFont = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-space-mono'
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code'
})

export default function Hero() {
  const { reducedMotion } = useTheme()
  const curveCanvasRef = useRef(null)
  const codeElementsRef = useRef([])
  const [time, setTime] = useState(0)
  
  const transition = {
    type: reducedMotion ? "tween" : "spring",
    duration: reducedMotion ? 0.15 : 0.5,
    stiffness: 260,
    damping: 20
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const codeSnippets = [
      '<React.Suspense fallback={<Loader />}>', 'useState<T>(initialState)', 'useEffect(() => {}, [])',
      'npm run build && npm start', 'git checkout -b feature/new-component', 'docker-compose up -d',
      'const { data, error } = await axios.get()', 'export default function Component()',
      'import React, { useContext } from "react"', '<motion.div animate={{ opacity: [0, 1] }}',
      'async/await', 'try { ... } catch (err) { ... }', 'Promise.all([fetch1, fetch2])',
      '.reduce((acc, val) => ({ ...acc, [val.id]: val }), {})',
      '.filter(Boolean).map(item => <Item key={item.id} {...item} />)',
      'React.lazy(() => import("./Component"))',
      'useCallback((e: React.MouseEvent) => handleClick(e), [deps])', 
      'useMemo(() => complexComputation(a, b), [a, b])',
      '/* FIXME: Optimize rendering */','// TODO: Add error handling',
      '/** @param {string} id - The unique identifier */', 'Record<string, unknown>',
      '@tailwind base; @tailwind components;', 'npx create-next-app --typescript',
      'export interface Props extends HTMLAttributes<HTMLDivElement> {}',
      '.then(res => res.json()).catch(handleError)', 'new Promise((resolve, reject) => {})',
      'Object.entries(data).map(([key, value]) => ({ key, value }))'
    ];
    
    codeElementsRef.current = Array(30).fill(0).map((_, i) => ({
      text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 14 + 10,
      color: `hsla(${Math.random() * 360}, 70%, 70%, ${Math.random() * 0.3 + 0.1})`,
      rotation: Math.random() * 360,
      lifespan: Math.random() * 20 + 10,
      age: 0
    }));
  }, []);

  useAnimationFrame((t) => {
    const elapsed = t / 1000;
    setTime(elapsed);
    
    codeElementsRef.current = codeElementsRef.current.map(element => {
      let x = element.x + element.vx;
      let y = element.y + element.vy;
      let age = element.age !== undefined ? element.age + 0.05 : 0;
      
      if (x < 0 || x > window.innerWidth) {
        element.vx *= -0.9;
        x = Math.max(0, Math.min(window.innerWidth, x));
      }
      if (y < 0 || y > window.innerHeight) {
        element.vy *= -0.9;
        y = Math.max(0, Math.min(window.innerHeight, y));
      }
      
      element.vx += (Math.random() - 0.5) * 0.05;
      element.vy += (Math.random() - 0.5) * 0.05;
      
      const maxSpeed = 2;
      const speed = Math.sqrt(element.vx * element.vx + element.vy * element.vy);
      if (speed > maxSpeed) {
        element.vx = (element.vx / speed) * maxSpeed;
        element.vy = (element.vy / speed) * maxSpeed;
      }
      
      if (element.lifespan && age >= element.lifespan) {
        const codeSnippets = codeElementsRef.current.map(e => e.text);
        return {
          text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: Math.random() * 14 + 10,
          color: `hsla(${Math.random() * 360}, 70%, 70%, ${Math.random() * 0.3 + 0.1})`,
          rotation: Math.random() * 360,
          lifespan: Math.random() * 20 + 10,
          age: 0
        };
      }
      
      const opacity = element.lifespan ? 
        (age / element.lifespan < 0.2 ? age / element.lifespan * 5 : 
        age / element.lifespan > 0.8 ? (1 - age / element.lifespan) * 5 : 
        1) : 1;
      
      return {
        ...element,
        x,
        y,
        age,
        opacity,
        rotation: element.rotation + 0.2,
        color: element.color.replace(/[\d.]+\)$/, `${opacity * 0.3})`),
      };
    });

    if (curveCanvasRef.current) {
      const canvas = curveCanvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      const drawParametricCurve = (fn, color, width, opacity, segments) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.globalAlpha = opacity;
        
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const [x, y] = fn(t, elapsed);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      };
      
      const a = 1, b = 1;
      const m1 = 6 + Math.sin(elapsed * 0.1) * 3;
      const n1 = 3 + Math.cos(elapsed * 0.2) * 2;
      const n2 = 1 + Math.sin(elapsed * 0.3);
      const n3 = 1 + Math.cos(elapsed * 0.2);
      
      const superformula = (t, time) => {
        const phi = t * Math.PI * 2;
        
        const part1 = Math.pow(Math.abs(Math.cos(m1 * phi / 4) / a), n2);
        const part2 = Math.pow(Math.abs(Math.sin(m1 * phi / 4) / b), n3);
        const r = Math.pow(part1 + part2, -1/n1);
        
        const scale = Math.min(rect.width, rect.height) * 0.35;
        const x = rect.width / 2 + scale * r * Math.cos(phi);
        const y = rect.height / 2 + scale * r * Math.sin(phi);
        
        return [x, y];
      };
      
      const lissajous = (t, time) => {
        const A = Math.min(rect.width, rect.height) * 0.25;
        const a = 3 + Math.sin(time * 0.2);
        const b = 2 + Math.cos(time * 0.3);
        const delta = time * 0.5;
        
        const x = rect.width / 2 + A * Math.sin(a * t * Math.PI * 2 + delta);
        const y = rect.height / 2 + A * Math.sin(b * t * Math.PI * 2);
        
        return [x, y];
      };
      
      const spiral = (t, time) => {
        const scale = Math.min(rect.width, rect.height) * 0.4;
        const spiralTightness = 10 + Math.sin(time * 0.3) * 5;
        const r = (t * scale) / spiralTightness;
        const theta = t * Math.PI * 20 + time;
        
        const x = rect.width / 2 + r * Math.cos(theta);
        const y = rect.height / 2 + r * Math.sin(theta);
        
        return [x, y];
      };
      
      const butterfly = (t, time) => {
        const scale = Math.min(rect.width, rect.height) * 0.2;
        const theta = t * Math.PI * 24;
        const exp = Math.exp(Math.cos(theta)) - 2 * Math.cos(4 * theta) + Math.pow(Math.sin(theta / 12), 5);
        
        const factor = 1 + 0.2 * Math.sin(time * 0.5);
        
        const x = rect.width / 2 + scale * factor * Math.sin(theta) * exp;
        const y = rect.height / 2 + scale * factor * Math.cos(theta) * exp;
        
        return [x, y];
      };
      
      const heart = (t, time) => {
        const scale = Math.min(rect.width, rect.height) * 0.15;
        const theta = t * Math.PI * 2;
        
        const pulse = 1 + Math.sin(time * 2) * 0.1;
        const x = rect.width / 2 + scale * pulse * 16 * Math.pow(Math.sin(theta), 3);
        const y = rect.height / 2 - scale * pulse * (13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta));
        
        return [x, y];
      };
      
      drawParametricCurve(superformula, 'hsla(var(--p)/0.15)', 2, 0.6, 500);
      drawParametricCurve(lissajous, 'hsla(var(--s)/0.1)', 1.5, 0.4, 300);
      drawParametricCurve(spiral, 'hsla(var(--a)/0.08)', 1, 0.3, 400);
      
      ctx.globalCompositeOperation = 'lighten';
      drawParametricCurve(butterfly, 'hsla(var(--in)/0.1)', 1, 0.3, 300);
      drawParametricCurve(heart, 'hsla(var(--er)/0.1)', 1, 0.25, 200);
      
      ctx.shadowColor = 'hsla(var(--p)/0.5)';
      ctx.shadowBlur = 5;
      drawParametricCurve(
        (t, time) => {
          const [x, y] = superformula(t, time);
          return [x + Math.sin(time) * 5, y + Math.cos(time) * 5];
        },
        'hsla(var(--ac)/0.2)', 2, 0.15, 300
      );
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';
    }
  });

  useEffect(() => {
    const handleResize = () => {
      if (curveCanvasRef.current) {
        curveCanvasRef.current.width = window.innerWidth;
        curveCanvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <section id="home" className={`${styles.heroSection} ${calligraphyFont.variable} relative min-h-[calc(100vh-4rem)]`}>
      {/* Background elements */}
      <canvas 
        ref={curveCanvasRef} 
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Code particle elements */}
        {codeElementsRef.current.map((element, index) => (
          <div
            key={index}
            className="absolute font-mono text-base-content/30 whitespace-nowrap"
            style={{
              left: element.x,
              top: element.y,
              fontSize: `${element.size}px`,
              color: element.color,
              transform: `rotate(${element.rotation}deg)`,
              transition: 'transform 0.5s ease-out'
            }}
          >
            {element.text}
          </div>
        ))}
      </div>
      
      {/* Grid and gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" /> {/* Increased opacity */}
        <div className={styles.gradientBg} />
        <motion.div 
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px'],
            opacity: [0.15, 0.25] // Increased opacity values for better visibility
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--p)) 1.5px, transparent 1.5px)', // Larger dots
            backgroundSize: '50px 50px'
          }}
        />      </div>      {/* Main content */}
      <div className={`container px-4 sm:px-6 relative z-10 py-4 ${calligraphyFont.variable} ${interFont.variable} ${spaceMono.variable} ${firaCode.variable}`}>
        {/* Hero card with glassmorphism effect */}
        <motion.div 
          className={styles.heroCard}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        ><div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Text content - takes more space on larger screens */}
            <motion.div
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Enhanced greeting with calligraphic styling */}
              <div className={styles.greetingContainer}>
                <motion.div 
                  className={styles.greeting}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >                  <span className={styles.codeTag}>{'<'}</span>
                  {/* Enhanced calligraphy text with better visibility */}
                  <motion.div
                    className={`px-2 relative inline-flex justify-center items-center`}
                    style={{ zIndex: 10 }}
                  >
                    {/* White background for better visibility */}
                    <motion.div 
                      className="absolute inset-0 bg-primary/20 rounded-md -rotate-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    
                    {/* Main text with strong visibility */}
                    <motion.span 
                      className={`text-2xl inline-block relative font-bold`}
                      style={{
                        fontFamily: "var(--font-calligraphy, 'Kalam', cursive)",
                        color: "red",
                        textShadow: "0 0 5px hsl(var(--p)), 0 0 10px hsl(var(--p)), 0 0 15px hsl(var(--a))",
                        WebkitTextStroke: "1px hsl(var(--p))",
                        transform: "rotate(-2deg)",
                        zIndex: 10
                      }}
                      initial={{ scale: 0.9, opacity: 0.8 }}
                      animate={{ 
                        scale: [0.9, 1, 0.9],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      नमस्कार
                    </motion.span>
                  </motion.div>
                  <motion.span 
                    className="inline-block ml-1"
                    animate={{ 
                      rotate: [0, 15, -5, 15, 0],
                      y: [0, -4, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    🙏
                  </motion.span>
                  <span className={styles.codeTag}>{'/>'}</span>
                </motion.div>
              </div>
              
              {/* Main heading with more impact */}
              <div className="space-y-3">
                <h1 className={styles.heading}>                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    I&apos;m{" "}
                    <motion.span
                      className="relative inline-block"
                      style={{
                        fontFamily: "var(--font-calligraphy, 'Kalam', cursive)",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        color: "#f5072f",
                        textShadow: "0 0 5px hsl(var(--p)/0.3), 0 0 10px hsl(var(--p)/0.2)",
                        WebkitTextStroke: "0.5px hsl(var(--p)/0.5)",
                        transform: "rotate(-1deg)",
                        display: "inline-block",
                        // padding: "0 0.1em",
                        zIndex: 5
                      }}
                      animate={{
                        scale: [1, 1.02, 1],
                        rotate: ["-1deg", "0deg", "-1deg"],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      Gaurav Kumar
                    </motion.span>
                  </motion.div>
                </h1>

                {/* Role with typing effect in a terminal-like container */}                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="inline-flex"
                >
                  <motion.div 
                    className={styles.roleWrapper}
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)" }}
                  >
                    <motion.span 
                      className={styles.typedPrefix}
                      initial={{ y: 0 }}
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      function
                    </motion.span>
                    <ReactTyped
                      strings={[
                        'SoftwareEngineer()',
                        'FullStackDev()',
                        'DataScienceEngineer()',
                        'MLEngineer()',
                        'RAGDeveloper()',
                        'AIEnthusiast()'
                      ]}
                      typeSpeed={60}
                      backSpeed={40}
                      loop
                      className={styles.typedText}
                    />
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Bio with enhanced styling */}
              <motion.div 
                className="space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >                <motion.p 
                  className={styles.bio}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  whileHover={{ 
                    x: 2,
                    boxShadow: '0 8px 20px -5px hsla(var(--b1)/0.3)',
                    transition: { duration: 0.3 }
                  }}
                >
                  I build modern web applications with a focus on{' '}
                  <motion.span 
                    className="text-primary font-medium"
                    whileHover={{ scale: 1.05, display: 'inline-block' }}
                  >
                    user experience
                  </motion.span>{' '}
                  and{' '}
                  <motion.span 
                    className="text-secondary font-medium"
                    whileHover={{ scale: 1.05, display: 'inline-block' }}
                  >
                    performance
                  </motion.span>, 
                  specializing in the{' '}
                  <motion.span 
                    className="text-accent font-medium"
                    whileHover={{ scale: 1.05, display: 'inline-block' }}
                  >
                    MERN stack
                  </motion.span>{' '}
                  and{' '}
                  <motion.span 
                    className="text-accent font-medium"
                    whileHover={{ scale: 1.05, display: 'inline-block' }}
                  >
                    Next.js
                  </motion.span>{' '}
                  ecosystem. My expertise extends to{' '}
                  <motion.span 
                    className="text-info font-medium"
                    whileHover={{ scale: 1.05, display: 'inline-block' }}
                  >
                    data science
                  </motion.span>{' '}
                  and{' '}
                  <motion.span 
                    className="text-success font-medium"
                    whileHover={{ scale: 1.05, display: 'inline-block' }}
                  >
                    machine learning
                  </motion.span>, 
                  implementing{' '}
                  <motion.span 
                    className="text-warning font-medium"
                    whileHover={{ scale: 1.05, display: 'inline-block' }}
                  >
                    RAG systems
                  </motion.span>{' '}
                  and{' '}
                  <motion.span 
                    className="text-error font-medium"
                    whileHover={{ scale: 1.05, display: 'inline-block' }}
                  >
                    AI-powered solutions
                  </motion.span>.
                </motion.p>
                  {/* Code comment with improved styling */}
                <motion.div 
                  className={styles.codeComment}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  whileHover={{ 
                    x: 3,
                    boxShadow: '0 5px 15px -5px hsla(var(--b1)/0.2)',
                    transition: { duration: 0.3 }
                  }}
                >
                  <motion.span 
                    className={styles.commentChar}
                    animate={{ 
                      opacity: [0.7, 1, 0.7],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    {'//'}
                  </motion.span>{' '}
                  <span className={styles.commentText}>
                    Transforming ideas into{' '}
                    <motion.span
                      style={{ 
                        fontFamily: "var(--font-calligraphy, 'Kalam', cursive)",
                        fontWeight: 700,
                      }}
                      animate={{ 
                        color: ['hsl(var(--p))', 'hsl(var(--s))', 'hsl(var(--p))']
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      elegant
                    </motion.span>{' '}
                    code one commit at a time
                  </span>
                </motion.div>
                  {/* Technology tags with a modern design */}
                <div className={styles.skillsContainer}>
                  {['MERN', 'Next.js','TypeScript','GENAI','RAG'].map((skill, index) => (
                    <motion.span
                      key={skill}
                      className={styles.skillBadge}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: { 
                          delay: 0.8 + (index * 0.1),
                          duration: 0.4,
                          type: "spring",
                          stiffness: 260,
                          damping: 20
                        }
                      }}
                      whileHover={{ 
                        y: -5, 
                        scale: 1.05,
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)'
                      }}
                      whileTap={{ 
                        scale: 0.95,
                        boxShadow: '0 5px 15px -5px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
                  {/* Call to action buttons with improved design */}
                <motion.div 
                  className={styles.ctaContainer}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 1.0,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 250,
                    damping: 20
                  }}
                >
                  <motion.a
                    href="#contact"
                    className={styles.primaryButton}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Get in Touch
                    <motion.span 
                      className={styles.buttonIcon}
                      animate={{ 
                        y: [0, -3, 0],
                        rotate: [0, 5, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 2.5
                      }}
                    >
                      ✉️
                    </motion.span>
                  </motion.a>
                  <motion.a
                    href="#projects"
                    className={styles.secondaryButton}
                    whileHover={{ 
                      scale: 1.05, 
                      backgroundColor: 'hsla(var(--b2)/0.8)',
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    View Projects
                    <motion.span 
                      className={styles.buttonIcon}
                      animate={{ 
                        x: [0, 3, 0],
                        y: [0, -3, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    >
                      🚀
                    </motion.span>
                  </motion.a>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Profile image container with enhanced visual effects */}
            <motion.div
              className="lg:col-span-5 flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className={styles.profileWrapper}>
                {/* Animated rings around profile */}
                <motion.div 
                  className={styles.orbitalRing}
                  style={{ animationDelay: '0s' }}
                />
                <motion.div 
                  className={styles.orbitalRing}
                  style={{ animationDelay: '1s' }}
                />
                <motion.div 
                  className={styles.orbitalRing}
                  style={{ animationDelay: '2s' }}
                />
                
                {/* Binary code ring */}
                <div className={styles.binaryCodeRing}>
                  {Array(24).fill(0).map((_, i) => {
                    const symbols = ['0', '1', '∞', 'π', '∑', '∫', '√', 'λ', '∇', '{}', '<>', '[]'];
                    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
                    const distance = 47 + (Math.random() * 5);
                    const angle = (i / 24) * Math.PI * 2;
                    
                    return (
                      <div 
                        key={i} 
                        className={styles.binaryDigit}
                        style={{ 
                          animationDelay: `${i * 0.15}s`,
                          left: `${50 + distance * Math.cos(angle)}%`,
                          top: `${50 + distance * Math.sin(angle)}%`,
                          fontSize: `${Math.random() * 4 + 12}px`,
                          opacity: Math.random() * 0.5 + 0.3
                        }}
                      >
                        {symbol}
                      </div>
                    );
                  })}
                </div>
                
                {/* Terminal-style profile frame */}
                <motion.div 
                  className={styles.terminalFrame}
                  animate={{
                    boxShadow: [
                      "0 0 10px hsla(var(--p)/0.3)",
                      "0 0 20px hsla(var(--p)/0.5)",
                      "0 0 10px hsla(var(--p)/0.3)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {/* Terminal header with macOS-style controls */}
                  <div className={styles.terminalHeader}>
                    <div className={styles.terminalControls}>
                      <div className={styles.terminalDot} style={{ backgroundColor: "#FF5F56" }}></div>
                      <div className={styles.terminalDot} style={{ backgroundColor: "#FFBD2E" }}></div>
                      <div className={styles.terminalDot} style={{ backgroundColor: "#27C93F" }}></div>
                    </div>
                    
                    <div className={styles.terminalTitle}>
                      <motion.span
                        animate={{ color: ['hsla(var(--bc)/0.7)', 'hsla(var(--p)/0.8)', 'hsla(var(--bc)/0.7)'] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        gaurav@developer ~ process running
                      </motion.span>
                    </div>
                  </div>
                  {/* Code overlay and scanline effect */}
                  <div className={styles.codeOverlay}></div>
                  {/* Profile image with effects */}
                  <motion.div
                    className={styles.imageContainer}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Image
                      src="/gaurav.jpg"
                      alt="Gaurav Kumar - Software Engineer"
                      fill
                      priority
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 380px"
                      className="object-cover"
                    />
                    {/* Code overlay and scanline effect */}
                    <div className={styles.codeOverlay}></div>
                    <div className={styles.scanline}></div>
                  </motion.div>
                </motion.div>
                {/* Decorative code brackets */}
                <motion.div 
                  className={styles.bracketLeft}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    x: [-5, 0, -5]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  {'{'}
                </motion.div>
                <motion.div 
                  className={styles.bracketRight}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    x: [5, 0, 5]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  {'}'}
                </motion.div>
              </div>            </motion.div>
          </div>
          
          {/* Mathematical formula with enhanced styling */}
          <motion.div
            className={styles.mathFormula}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.03 }}
          >
            <motion.span className={styles.sigma}>∑</motion.span>
            <motion.span className={styles.formulaText}>
              (creativity<sup>2</sup> + technology<sup>expertise</sup>) × passion = 
              <motion.span
                className={styles.resultText}
                animate={{
                  color: [
                    'hsl(var(--p))',
                    'hsl(var(--s))',
                    'hsl(var(--a))',
                    'hsl(var(--p))'
                  ]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                exceptional_results
              </motion.span>
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
