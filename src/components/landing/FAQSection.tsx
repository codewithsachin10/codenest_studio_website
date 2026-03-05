import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFaqs } from "@/hooks/useFaqs";

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const { data: faqs = [], isLoading } = useFaqs(true); // Only published FAQs

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Show loading state
    if (isLoading) {
        return (
            <section className="py-20 md:py-28">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </div>
            </section>
        );
    }

    // If no FAQs in database, don't render the section
    if (faqs.length === 0) {
        return null;
    }

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
                        <HelpCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">FAQ</span>
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground">
                        Got questions? We've got answers. If you don't find what you're
                        looking for, feel free to reach out.
                    </p>
                </motion.div>

                <motion.div
                    className="mx-auto max-w-3xl space-y-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className={cn(
                                "overflow-hidden rounded-xl border transition-all duration-300",
                                openIndex === index
                                    ? "border-primary/40 bg-surface shadow-lg shadow-primary/5"
                                    : "border-border/50 bg-surface/50 hover:border-border"
                            )}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="flex w-full items-center justify-between gap-4 p-5 text-left"
                            >
                                <span className="font-medium text-foreground">
                                    {faq.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="shrink-0"
                                >
                                    <ChevronDown
                                        className={cn(
                                            "h-5 w-5 transition-colors",
                                            openIndex === index
                                                ? "text-primary"
                                                : "text-muted-foreground"
                                        )}
                                    />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="border-t border-border/30 px-5 pb-5 pt-4">
                                            <p className="text-muted-foreground leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FAQSection;
