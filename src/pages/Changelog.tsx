import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Rocket, Bug, Sparkles, Wrench, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const changelogData = [
    {
        version: "1.0.0",
        date: "February 2026",
        title: "Official Release",
        type: "major",
        changes: [
            {
                category: "feature",
                description: "One-click language installation for C, C++, Python, Java, and JavaScript",
            },
            {
                category: "feature",
                description: "Built-in terminal with full shell access",
            },
            {
                category: "feature",
                description: "Syntax highlighting with 50+ themes",
            },
            {
                category: "feature",
                description: "Offline-first architecture - works without internet",
            },
            {
                category: "feature",
                description: "Cross-platform support: Windows, macOS, Linux",
            },
            {
                category: "feature",
                description: "Beginner-friendly error messages and hints",
            },
        ],
    },
    {
        version: "0.9.0",
        date: "January 2026",
        title: "Release Candidate",
        type: "minor",
        changes: [
            {
                category: "improvement",
                description: "Improved startup performance by 40%",
            },
            {
                category: "improvement",
                description: "Enhanced code completion for Python",
            },
            {
                category: "fix",
                description: "Fixed terminal encoding issues on Windows",
            },
            {
                category: "fix",
                description: "Resolved memory leak when opening large files",
            },
        ],
    },
    {
        version: "0.8.0",
        date: "December 2025",
        title: "Beta Release",
        type: "minor",
        changes: [
            {
                category: "feature",
                description: "Added Java language support",
            },
            {
                category: "feature",
                description: "Introduced file tree navigation",
            },
            {
                category: "improvement",
                description: "Better error handling for compilation failures",
            },
            {
                category: "fix",
                description: "Fixed keyboard shortcuts on macOS",
            },
        ],
    },
    {
        version: "0.5.0",
        date: "November 2025",
        title: "Alpha Release",
        type: "minor",
        changes: [
            {
                category: "feature",
                description: "Initial release with C, C++, and Python support",
            },
            {
                category: "feature",
                description: "Basic code editor with syntax highlighting",
            },
            {
                category: "feature",
                description: "Simple run functionality",
            },
        ],
    },
];

const roadmapItems = [
    "TypeScript / Node.js support",
    "Git integration",
    "Extension marketplace",
    "Collaborative coding (local network)",
    "More themes and customization",
];

const getCategoryIcon = (category: string) => {
    switch (category) {
        case "feature":
            return <Sparkles className="h-4 w-4 text-green-500" />;
        case "improvement":
            return <Wrench className="h-4 w-4 text-blue-500" />;
        case "fix":
            return <Bug className="h-4 w-4 text-orange-500" />;
        default:
            return <Sparkles className="h-4 w-4 text-primary" />;
    }
};

const getCategoryLabel = (category: string) => {
    switch (category) {
        case "feature":
            return "New";
        case "improvement":
            return "Improved";
        case "fix":
            return "Fixed";
        default:
            return category;
    }
};

const Changelog = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pt-16">
                {/* Hero */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="mx-auto max-w-2xl text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
                                <Rocket className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-primary">
                                    What's New
                                </span>
                            </div>
                            <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                                Changelog
                            </h1>
                            <p className="text-muted-foreground">
                                Track the evolution of CodeNest Studio. See what's new, what's
                                improved, and what's coming next.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Timeline */}
                <section className="pb-16">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-3xl">
                            {changelogData.map((release, index) => (
                                <motion.div
                                    key={release.version}
                                    className="relative pb-12 pl-8 md:pl-12"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    {/* Timeline line */}
                                    {index !== changelogData.length - 1 && (
                                        <div className="absolute left-[11px] top-8 h-full w-px bg-border/50 md:left-[15px]" />
                                    )}

                                    {/* Timeline dot */}
                                    <div
                                        className={cn(
                                            "absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full md:h-8 md:w-8",
                                            release.type === "major"
                                                ? "bg-primary"
                                                : "bg-surface-elevated border border-border"
                                        )}
                                    >
                                        <Tag
                                            className={cn(
                                                "h-3 w-3 md:h-4 md:w-4",
                                                release.type === "major"
                                                    ? "text-primary-foreground"
                                                    : "text-muted-foreground"
                                            )}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="rounded-xl border border-border/50 bg-surface/50 p-6">
                                        <div className="mb-4 flex flex-wrap items-center gap-3">
                                            <span
                                                className={cn(
                                                    "rounded-full px-3 py-1 text-sm font-semibold",
                                                    release.type === "major"
                                                        ? "bg-primary/20 text-primary"
                                                        : "bg-muted text-muted-foreground"
                                                )}
                                            >
                                                v{release.version}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {release.date}
                                            </span>
                                        </div>

                                        <h3 className="mb-4 text-lg font-semibold text-foreground">
                                            {release.title}
                                        </h3>

                                        <ul className="space-y-3">
                                            {release.changes.map((change, changeIndex) => (
                                                <li
                                                    key={changeIndex}
                                                    className="flex items-start gap-3"
                                                >
                                                    <span className="mt-0.5 flex items-center gap-1.5">
                                                        {getCategoryIcon(change.category)}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">
                                                        <span
                                                            className={cn(
                                                                "mr-2 rounded px-1.5 py-0.5 text-xs font-medium",
                                                                change.category === "feature" &&
                                                                "bg-green-500/10 text-green-500",
                                                                change.category === "improvement" &&
                                                                "bg-blue-500/10 text-blue-500",
                                                                change.category === "fix" &&
                                                                "bg-orange-500/10 text-orange-500"
                                                            )}
                                                        >
                                                            {getCategoryLabel(change.category)}
                                                        </span>
                                                        {change.description}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Roadmap */}
                <section className="border-t border-border/30 bg-card/30 py-16">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="mx-auto max-w-2xl text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="mb-4 text-2xl font-bold text-foreground">
                                Coming Soon
                            </h2>
                            <p className="mb-8 text-muted-foreground">
                                Here's what we're working on next. Have a feature request?
                                Let us know!
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {roadmapItems.map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full border border-border/50 bg-surface px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Changelog;
