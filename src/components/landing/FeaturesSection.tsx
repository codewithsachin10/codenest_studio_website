import { motion, type Variants } from "framer-motion";
import {
  Code,
  CloudOff,
  Terminal,
  GitBranch,
  Palette,
  Rocket,
  Brain,
  Plug,
  GraduationCap,
  Zap,
  Shield,
  Loader2,
  type LucideIcon
} from "lucide-react";
import { useFeatures } from "@/hooks/useFeatures";

// Icon mapping for features from database
const iconMap: Record<string, LucideIcon> = {
  code: Code,
  cloud: CloudOff,
  "cloud-off": CloudOff,
  terminal: Terminal,
  "git-branch": GitBranch,
  palette: Palette,
  rocket: Rocket,
  brain: Brain,
  plug: Plug,
  "graduation-cap": GraduationCap,
  zap: Zap,
  shield: Shield,
};

const getIconComponent = (iconName: string | null): LucideIcon => {
  if (!iconName) return Code;
  return iconMap[iconName.toLowerCase()] || Code;
};

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const FeaturesSection = () => {
  const { data: features = [], isLoading } = useFeatures(true); // Only published features

  // Show loading state
  if (isLoading) {
    return (
      <section id="features" className="border-t border-border/30 bg-card/30 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  // If no features in database, don't render the section
  if (features.length === 0) {
    return null;
  }

  return (
    <section id="features" className="border-t border-border/30 bg-card/30 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Why CodeNest Studio?
          </h2>
          <p className="text-muted-foreground">
            Built from the ground up to remove friction from learning to code.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature) => {
            const IconComponent = getIconComponent(feature.icon);
            return (
              <motion.div
                key={feature.id}
                className="card-hover rounded-xl border border-border/50 bg-surface p-6"
                variants={itemVariants}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
