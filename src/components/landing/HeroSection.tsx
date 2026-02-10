import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
    <div className="overflow-hidden rounded-lg border border-border/50 bg-card/80 p-4 font-mono text-xs md:text-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-red-500/80" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <div className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-muted-foreground">main.py</span>
      </div>
      <div className="space-y-1">
        {codeLines.slice(0, visibleLines).map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center"
          >
            <span className="mr-4 w-4 text-right text-muted-foreground/50">
              {index + 1}
            </span>
            <span
              className={
                line.text.startsWith("def") || line.text.startsWith("print")
                  ? "text-blue-400"
                  : line.text.startsWith("#")
                    ? "text-green-500"
                    : line.text.includes("return")
                      ? "text-purple-400"
                      : "text-foreground"
              }
            >
              {line.text}
              {index === visibleLines - 1 && (
                <motion.span
                  className="ml-0.5 inline-block h-4 w-1.5 bg-primary"
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

const HeroSection = () => {
  const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pb-32 md:pt-40">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <motion.div
        className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container relative mx-auto px-4">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Play className="h-3 w-3 text-primary" />
            <span className="text-sm font-medium text-primary">
              Free & Open Source
            </span>
          </motion.div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            A beginner-friendly, offline IDE{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              that just works.
            </span>
          </h1>

          <p className="mb-10 text-lg text-muted-foreground md:text-xl">
            No compiler confusion. No internet dependency. Just code.
          </p>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <Button variant="hero" size="xl" asChild className="glow-primary">
              <Link to="/download">
                <Download className="h-5 w-5" />
                Download for Windows
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <a href="#features" onClick={scrollToFeatures}>
                View Features
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Product Screenshot with Code Animation */}
        <motion.div
          className="relative mx-auto mt-16 max-w-5xl md:mt-24"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          {/* Floating code animation */}
          <motion.div
            className="absolute -left-4 top-8 z-10 hidden w-72 lg:block"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <TypedCode />
          </motion.div>

          <div className="overflow-hidden rounded-xl border border-border/50 shadow-2xl shadow-primary/10">
            <img
              src={editorScreenshot}
              alt="CodeNest Studio interface showing code editor with syntax highlighting"
              className="w-full"
            />
          </div>

          {/* Caption badges */}
          <motion.div
            className="mt-6 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {[
              { label: "Offline-first", emoji: "🌐" },
              { label: "Built-in terminal", emoji: "💻" },
              { label: "Multi-language support", emoji: "🚀" },
            ].map((caption) => (
              <motion.span
                key={caption.label}
                className="flex items-center gap-2 rounded-full border border-border/50 bg-surface px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{caption.emoji}</span>
                {caption.label}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
