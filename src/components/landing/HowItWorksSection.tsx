import { Download, Languages, Play } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: Download,
    title: "Download CodeNest Studio",
    description: "Quick installation, no complex setup wizards.",
  },
  {
    number: "02",
    icon: Languages,
    title: "Choose your languages",
    description: "Select the languages you want to learn. One-click install.",
  },
  {
    number: "03",
    icon: Play,
    title: "Start coding offline",
    description: "Write, run, and debug your code. Everything works locally.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div 
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="text-muted-foreground">
            Get started in minutes, not hours.
          </p>
        </motion.div>

        <motion.div 
          className="mx-auto flex max-w-4xl flex-col gap-8 md:flex-row"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={step.number} 
              className="relative flex-1"
              variants={itemVariants}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-px w-full bg-border/50 md:block" />
              )}
              
              <div className="relative flex flex-col items-center text-center">
                <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-primary/10" />
                  <span className="absolute -top-2 -right-2 rounded-full bg-surface-elevated px-2 py-0.5 text-xs font-medium text-primary">
                    {step.number}
                  </span>
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
