import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Ban, Lock, HardDrive, Download } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const trustPoints = [
  {
    icon: Ban,
    title: "No ads",
    description: "Clean interface, zero distractions.",
  },
  {
    icon: Lock,
    title: "No forced login",
    description: "Use the full app without creating an account.",
  },
  {
    icon: HardDrive,
    title: "Your code stays on your machine",
    description: "We never upload, scan, or store your code.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const TrustSection = () => {
  return (
    <section className="border-t border-border/30 bg-card/30 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div 
          className="mx-auto mb-12 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Privacy-First</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            We respect your privacy
          </h2>
          <p className="text-muted-foreground">
            CodeNest Studio is built on trust. No hidden agendas, no data collection.
          </p>
        </motion.div>

        <motion.div 
          className="mx-auto mb-12 grid max-w-3xl gap-6 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {trustPoints.map((point) => (
            <motion.div
              key={point.title}
              className="flex flex-col items-center text-center"
              variants={itemVariants}
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-elevated">
                <point.icon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-1 font-semibold text-foreground">{point.title}</h3>
              <p className="text-sm text-muted-foreground">{point.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button variant="hero" size="xl" asChild>
            <Link to="/download">
              <Download className="h-5 w-5" />
              Download Now
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
