import { motion, type Variants } from "framer-motion";

// Import local language icons (open-source, legally safe)
import cIcon from "@/assets/icons/language-c.svg";
import pythonIcon from "@/assets/icons/language-python.svg";
import javaIcon from "@/assets/icons/language-java.svg";
import cppIcon from "@/assets/icons/language-cpp.svg";
import javascriptIcon from "@/assets/icons/language-javascript.svg";

const languages = [
  {
    name: "C",
    icon: cIcon,
    description: "Systems programming",
    extensions: [".c", ".h"],
  },
  {
    name: "Python",
    icon: pythonIcon,
    description: "Beginner friendly",
    extensions: [".py"],
  },
  {
    name: "Java",
    icon: javaIcon,
    description: "Enterprise & Android",
    extensions: [".java"],
  },
  {
    name: "C++",
    icon: cppIcon,
    description: "Performance critical",
    extensions: [".cpp", ".hpp"],
  },
  {
    name: "JavaScript",
    icon: javascriptIcon,
    description: "Web development",
    extensions: [".js", ".mjs"],
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const SupportedLanguagesSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            One-Click Language Setup
          </h2>
          <p className="text-muted-foreground">
            Install your favorite programming languages with a single click.
            No manual PATH configuration or compiler headaches.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {languages.map((lang) => (
            <motion.div
              key={lang.name}
              className="group flex flex-col items-center rounded-xl border border-border/40 bg-surface/50 p-5 text-center transition-all duration-300 hover:border-primary/40 hover:bg-surface hover:shadow-lg hover:shadow-primary/5"
              variants={itemVariants}
            >
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-lg bg-card/80 p-2 transition-transform duration-300 group-hover:scale-110">
                <img
                  src={lang.icon}
                  alt={`${lang.name} programming language icon`}
                  className="h-10 w-10 object-contain"
                  loading="lazy"
                />
              </div>
              <h3 className="mb-1 text-base font-semibold text-foreground">
                {lang.name}
              </h3>
              <p className="mb-2 text-xs text-muted-foreground">
                {lang.description}
              </p>
              <div className="flex flex-wrap justify-center gap-1">
                {lang.extensions.map((ext) => (
                  <span
                    key={ext}
                    className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="mx-auto mt-8 max-w-lg text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          More languages coming soon. All icons are locally hosted and
          open-source licensed.
        </motion.p>
      </div>
    </section>
  );
};

export default SupportedLanguagesSection;
