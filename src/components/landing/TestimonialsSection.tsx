import { motion, type Variants } from "framer-motion";
import { Star, Quote, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTestimonials } from "@/hooks/useTestimonials";

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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

// Helper to get initials from name
const getInitials = (name: string): string => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const TestimonialsSection = () => {
    const { data: testimonials = [], isLoading } = useTestimonials(true); // Only published

    // Show loading state
    if (isLoading) {
        return (
            <section className="border-t border-border/30 bg-card/30 py-20 md:py-28">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </div>
            </section>
        );
    }

    // If no testimonials in database, don't render the section
    if (testimonials.length === 0) {
        return null;
    }

    return (
        <section className="border-t border-border/30 bg-card/30 py-20 md:py-28">
            <div className="container mx-auto px-4">
                <motion.div
                    className="mx-auto mb-12 max-w-2xl text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
                        <Quote className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                            Testimonials
                        </span>
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                        Loved by Students & Educators
                    </h2>
                    <p className="text-muted-foreground">
                        Join thousands of developers who've made CodeNest their go-to IDE
                        for learning and building.
                    </p>
                </motion.div>

                <motion.div
                    className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            variants={itemVariants}
                            className={cn(
                                "group relative flex flex-col rounded-xl border p-6 transition-all duration-300",
                                index === 0 || index === 3
                                    ? "border-primary/40 bg-gradient-to-b from-primary/10 to-transparent shadow-lg shadow-primary/5"
                                    : "border-border/50 bg-surface/50 hover:border-border hover:bg-surface"
                            )}
                        >
                            {/* Quote Icon */}
                            <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/10" />

                            {/* Rating */}
                            <div className="mb-4 flex gap-0.5">
                                {[...Array(testimonial.rating || 5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="h-4 w-4 fill-yellow-500 text-yellow-500"
                                    />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                                "{testimonial.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                    {testimonial.avatar || getInitials(testimonial.name)}
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {testimonial.role}
                                        {testimonial.company && ` • ${testimonial.company}`}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {[
                        { value: "10,000+", label: "Downloads" },
                        { value: "4.9/5", label: "Average Rating" },
                        { value: "50+", label: "Universities" },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <p className="text-2xl font-bold text-primary md:text-3xl">
                                {stat.value}
                            </p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
