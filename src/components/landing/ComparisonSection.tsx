import { motion } from "framer-motion";
import { Check, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const comparisonData = [
    {
        feature: "Works Offline",
        codenest: true,
        onlineIDEs: false,
        note: "No internet required",
    },
    {
        feature: "One-Click Language Setup",
        codenest: true,
        onlineIDEs: "partial",
        note: "Auto-configures PATH",
    },
    {
        feature: "100% Free",
        codenest: true,
        onlineIDEs: "partial",
        note: "No premium tiers",
    },
    {
        feature: "No Account Required",
        codenest: true,
        onlineIDEs: false,
        note: "Start coding instantly",
    },
    {
        feature: "Code Stays Private",
        codenest: true,
        onlineIDEs: false,
        note: "Nothing uploaded",
    },
    {
        feature: "Built-in Terminal",
        codenest: true,
        onlineIDEs: true,
        note: "Full terminal access",
    },
    {
        feature: "Beginner-Friendly UI",
        codenest: true,
        onlineIDEs: "partial",
        note: "Clean, focused interface",
    },
    {
        feature: "No Execution Limits",
        codenest: true,
        onlineIDEs: false,
        note: "Run code unlimited",
    },
];

const FeatureCell = ({
    value,
}: {
    value: boolean | "partial";
}) => {
    if (value === true) {
        return (
            <div className="flex items-center justify-center">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20">
                    <Check className="h-4 w-4 text-green-500" />
                </div>
            </div>
        );
    }
    if (value === false) {
        return (
            <div className="flex items-center justify-center">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20">
                    <X className="h-4 w-4 text-red-500" />
                </div>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-center">
            <span className="text-xs text-yellow-500">Limited</span>
        </div>
    );
};

const ComparisonSection = () => {
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
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Comparison</span>
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                        Why Choose CodeNest Studio?
                    </h2>
                    <p className="text-muted-foreground">
                        See how CodeNest compares to online IDEs and cloud-based solutions.
                    </p>
                </motion.div>

                <motion.div
                    className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-border/50 bg-surface/50"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Header */}
                    <div className="grid grid-cols-3 border-b border-border/50 bg-surface">
                        <div className="p-4">
                            <span className="text-sm font-medium text-muted-foreground">
                                Feature
                            </span>
                        </div>
                        <div className="flex flex-col items-center justify-center border-l border-border/30 bg-primary/5 p-4">
                            <span className="text-sm font-bold text-primary">
                                CodeNest Studio
                            </span>
                        </div>
                        <div className="flex flex-col items-center justify-center border-l border-border/30 p-4">
                            <span className="text-sm font-medium text-muted-foreground">
                                Online IDEs
                            </span>
                        </div>
                    </div>

                    {/* Rows */}
                    {comparisonData.map((row, index) => (
                        <div
                            key={row.feature}
                            className={cn(
                                "grid grid-cols-3 transition-colors hover:bg-surface",
                                index !== comparisonData.length - 1 && "border-b border-border/30"
                            )}
                        >
                            <div className="flex flex-col justify-center p-4">
                                <span className="font-medium text-foreground text-sm">
                                    {row.feature}
                                </span>
                                {row.note && (
                                    <span className="text-xs text-muted-foreground mt-0.5">
                                        {row.note}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-center border-l border-border/30 bg-primary/5 p-4">
                                <FeatureCell value={row.codenest} />
                            </div>
                            <div className="flex items-center justify-center border-l border-border/30 p-4">
                                <FeatureCell value={row.onlineIDEs} />
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.p
                    className="mx-auto mt-8 max-w-lg text-center text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    CodeNest Studio combines the power of a desktop IDE with the
                    simplicity beginners need. No compromises.
                </motion.p>
            </div>
        </section>
    );
};

export default ComparisonSection;
