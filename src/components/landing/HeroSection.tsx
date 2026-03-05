import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  ArrowRight, 
  Play, 
  ChevronDown, 
  Code2, 
  Terminal, 
  Cpu, 
  Globe, 
  Layers, 
  Zap,
  ShieldCheck,
  Monitor
} from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import editorScreenshot from "@/assets/editor-screenshot.png";

// Code typing animation data
const codeLines = [
  { text: 'def greet(name):', delay: 0 },
  { text: '    message = f"Hello, {name}!"', delay: 0.8 },
  { text: '    return message', delay: 1.4 },
  { text: '', delay: 2.0 },
  { text: 'print(greet("World"))', delay: 2.2 },
  { text: '# Output: Hello, World!', delay: 3.0 },
];

const TypedCode = () => {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    const timers = codeLines.map((line, index) => {
      return setTimeout(() => {
        setVisibleLines(index + 1);
      }, line.delay * 1000);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-5 font-mono text-xs md:text-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl ring-1 ring-white/10">
      <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        </div>
        <div className="flex items-center gap-2">
          <Terminal className="h-3 w-3 text-muted-foreground" />
          <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-[0.2em] font-semibold">main.py — CodeNest</span>
        </div>
      </div>
      <div className="space-y-1.5 pt-1">
        {codeLines.slice(0, visibleLines).map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center"
          >
            <span className="mr-4 w-4 text-right text-white/10 select-none font-mono text-[10px]">
              {index + 1}
            </span>
            <span
              className={
                line.text.startsWith("def") || line.text.startsWith("print")
                  ? "text-blue-400"
                  : line.text.startsWith("#")
                    ? "text-green-500/60 italic font-light"
                    : line.text.includes("return")
                      ? "text-purple-400"
                      : "text-white/90"
              }
            >
              {line.text}
              {index === visibleLines - 1 && (
                <motion.span
                  className="ml-0.5 inline-block h-4 w-1.5 bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Floating background particles with Icons
const CodeParticle = ({ Icon, top, left, delay, duration, size, blur }: any) => (
  <motion.div
    className="absolute text-primary/20 pointer-events-none select-none transition-all duration-700"
    style={{ top, left, filter: `blur(${blur}px)` }}
    animate={{
      y: [0, -60, 0],
      x: [0, 20, 0],
      opacity: [0.05, 0.2, 0.05],
      rotate: [0, 15, -15, 0],
      scale: [1, 1.1, 1]
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    <Icon size={size} strokeWidth={1} />
  </motion.div>
);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120, // Faster response
    damping: 30,   // More control
    restDelta: 0.001
  });

  // Simplified and fast transforms - No Blurs for performance
  const opacityHeader = useTransform(smoothProgress, [0, 0.25], [1, 0]);
  const yHeader = useTransform(smoothProgress, [0, 0.25], [0, -100]);
  const scaleHeader = useTransform(smoothProgress, [0, 0.25], [1, 0.95]);

  const opacityScreenshot = useTransform(smoothProgress, [0.15, 0.4, 0.8, 1], [0, 1, 1, 0.4]);
  const scaleScreenshot = useTransform(smoothProgress, [0.15, 0.5, 0.85], [0.85, 1, 1.05]);
  const rotateScreenshot = useTransform(smoothProgress, [0.15, 0.5], [8, 0]);
  const yScreenshot = useTransform(smoothProgress, [0.15, 0.5, 0.9], [80, 0, -40]);

  const radialScale = useTransform(smoothProgress, [0, 1], [1, 1.5]);
  const opacityIndicator = useTransform(smoothProgress, [0, 0.05], [1, 0]);

  const particles = [
    { Icon: Code2, top: "10%", left: "5%", size: 60, duration: 12, delay: 0 },
    { Icon: Terminal, top: "20%", left: "90%", size: 45, duration: 15, delay: 2 },
    { Icon: Globe, top: "60%", left: "3%", size: 80, duration: 18, delay: 1 },
    { Icon: Zap, top: "80%", left: "88%", size: 50, duration: 10, delay: 3 },
    { Icon: Layers, top: "40%", left: "12%", size: 35, duration: 9, delay: 4 },
    { Icon: Cpu, top: "5%", left: "80%", size: 70, duration: 14, delay: 0.5 },
  ];

  const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-[220vh] bg-background selection:bg-primary/30"
    >
      {/* Sticky Frame */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-2000">
        
        {/* Dynamic Background */}
        <motion.div 
          className="absolute inset-0 z-0 bg-gradient-radial from-primary/10 via-background to-background pointer-events-none"
          style={{ 
            scale: radialScale,
            opacity: useTransform(smoothProgress, [0, 0.5, 1], [0.5, 0.9, 0.5])
          }}
        />

        {/* Parallax Icons - Removed Blurs */}
        {particles.map((p, i) => (
          <CodeParticle key={i} {...p} blur={0} />
        ))}
        
        <div className="container relative mx-auto px-4 z-10 flex flex-col items-center h-full justify-center">
          
          {/* PHASE 1: TITLES */}
          <motion.div
            className="absolute z-30 text-center w-full max-w-5xl px-4"
            style={{ 
              opacity: opacityHeader,
              scale: scaleHeader,
              y: yHeader
            }}
          >
            <motion.div
              className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </div>
              <span className="text-[10px] font-bold text-white/80 tracking-[0.3em] uppercase">
                The Future of Offline Coding
              </span>
            </motion.div>

            <div className="relative overflow-hidden mb-8">
              <h1 className="text-6xl font-black tracking-tighter text-foreground md:text-9xl lg:text-[9rem] leading-[0.85] uppercase italic">
                Focus on <br />
                <span className="relative inline-block text-transparent bg-clip-text bg-white/10">
                  Creation.
                  <motion.span 
                    className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x overflow-hidden"
                    style={{ clipPath: `inset(0 ${useTransform(smoothProgress, [0, 0.15], ["100%", "0%"]).get()} 0 0)` }}
                  >
                    Creation.
                  </motion.span>
                </span>
              </h1>
            </div>

            <p className="mb-12 text-lg text-muted-foreground/90 md:text-xl max-w-2xl mx-auto font-medium tracking-tight leading-relaxed">
              Experience the pure joy of coding without distractions. 
              The IDE that empowers your flow, anywhere on Earth.
            </p>

            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Button variant="hero" size="xl" asChild className="glow-primary group min-w-[220px] rounded-2xl h-16 text-lg font-bold shadow-2xl">
                <Link to="/download">
                  <Download className="mr-3 h-6 w-6 transition-transform group-hover:scale-110" />
                  Get CodeNest
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild className="min-w-[200px] rounded-2xl h-16 text-lg font-medium border-white/10 backdrop-blur-xl">
                <a href="#features" onClick={scrollToFeatures}>
                  Features
                  <ChevronDown className="ml-2 h-5 w-5 animate-bounce" />
                </a>
              </Button>
            </div>
          </motion.div>

          {/* PHASE 2: IMAGE SHOWCASE - NO BLUR */}
          <motion.div
            className="relative w-full max-w-6xl mx-auto preserved-3d"
            style={{ 
              opacity: opacityScreenshot,
              scale: scaleScreenshot,
              rotateX: rotateScreenshot,
              y: yScreenshot
            }}
          >
             {/* Dynamic Code Card */}
             <motion.div
              className="absolute -left-16 top-32 z-40 hidden w-80 lg:block shadow-2xl"
              style={{ 
                y: useTransform(smoothProgress, [0.1, 0.9], [100, -150]),
                rotateY: -10
              }}
            >
              <TypedCode />
            </motion.div>

            {/* Premium Frame */}
            <div className="relative group">
               <motion.div 
                 className="absolute -inset-10 bg-primary/10 opacity-0 blur-[100px] transition-opacity duration-1000 group-hover:opacity-100"
               />
               
               <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] bg-card/20 backdrop-blur-sm p-2 ring-1 ring-white/10 shadow-2xl">
                <div className="relative overflow-hidden rounded-[1.2rem] md:rounded-[2.2rem] border border-white/5 bg-black/40">
                  <img
                    src={editorScreenshot}
                    alt="CodeNest Studio UI Preview"
                    className="w-full opacity-100"
                  />
                </div>
              </div>
            </div>

            {/* Phase 3: Fly-in Feature Cards */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full flex justify-center gap-6">
              {[
                { label: "Turbo Core", desc: "Instantly ready", icon: Zap, color: "text-yellow-400" },
                { label: "Privacy First", desc: "No cloud telemetry", icon: ShieldCheck, color: "text-green-400" },
                { label: "Fluid UI", desc: "GPU accelerated", icon: Monitor, color: "text-blue-400" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex flex-col items-center gap-4"
                  style={{ 
                    opacity: useTransform(smoothProgress, [0.4, 0.6], [0, 1]),
                    y: useTransform(smoothProgress, [0.4, 0.6], [20, 0]),
                  }}
                >
                  <div className="flex items-center gap-4 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 backdrop-blur-xl ring-1 ring-white/5 shadow-xl transition-all hover:bg-white/10">
                    <div className={`p-2 rounded-xl bg-black/20 ${item.color}`}>
                      <item.icon size={20} strokeWidth={2} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-foreground leading-none mb-0.5">{item.label}</p>
                      <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Scroll Hint */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50 pointer-events-none"
          style={{ opacity: opacityIndicator }}
        >
          <div className="h-10 w-6 border-2 border-white/20 rounded-full flex justify-center p-1">
            <motion.div 
              className="w-1 h-2 bg-primary rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
        </motion.div>

      </div>

      {/* Background Accent Gradients - Simplified */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="absolute top-1/4 -right-1/4 w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-1/4 w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-[120px]" />
      </div>
    </section>
  );
};

export default HeroSection;
