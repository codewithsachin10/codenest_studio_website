import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCreateSubscriber } from "@/hooks/useSubscribers";

const NewsletterSection = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
        "idle"
    );
    const [errorMessage, setErrorMessage] = useState("");
    const createSubscriber = useCreateSubscriber();

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        if (!email.trim()) {
            setErrorMessage("Please enter your email address");
            setStatus("error");
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage("Please enter a valid email address");
            setStatus("error");
            return;
        }

        setStatus("loading");

        try {
            await createSubscriber.mutateAsync({
                email: email.trim(),
                status: "active",
            });
            setStatus("success");
            setEmail("");
        } catch (error: unknown) {
            setStatus("error");
            if (error instanceof Error) {
                setErrorMessage(error.message || "Failed to subscribe. Please try again.");
            } else {
                setErrorMessage("Failed to subscribe. Please try again.");
            }
        }
    };

    return (
        <section className="border-t border-border/30 py-20 md:py-28">
            <div className="container mx-auto px-4">
                <motion.div
                    className="mx-auto max-w-2xl rounded-2xl border border-border/50 bg-gradient-to-b from-primary/10 via-surface to-surface p-8 md:p-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                    </div>

                    <div className="mb-8 text-center">
                        <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
                            Stay Updated
                        </h2>
                        <p className="text-muted-foreground">
                            Get notified about new features, language updates, and tips for
                            getting the most out of CodeNest Studio.
                        </p>
                    </div>

                    {status === "success" ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-3 rounded-lg bg-green-500/10 p-6 text-center"
                        >
                            <CheckCircle className="h-10 w-10 text-green-500" />
                            <div>
                                <p className="font-medium text-foreground">You're subscribed!</p>
                                <p className="text-sm text-muted-foreground">
                                    We'll keep you updated with the latest news.
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (status === "error") {
                                            setStatus("idle");
                                            setErrorMessage("");
                                        }
                                    }}
                                    className={cn(
                                        "h-12 flex-1 bg-background/50 text-base",
                                        status === "error" &&
                                        "border-red-500 focus-visible:ring-red-500"
                                    )}
                                    disabled={status === "loading"}
                                />
                                <Button
                                    type="submit"
                                    variant="hero"
                                    className="h-12 px-6"
                                    disabled={status === "loading"}
                                >
                                    {status === "loading" ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Subscribe
                                        </>
                                    )}
                                </Button>
                            </div>
                            {errorMessage && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm text-red-500"
                                >
                                    {errorMessage}
                                </motion.p>
                            )}
                            <p className="text-center text-xs text-muted-foreground">
                                No spam, ever. Unsubscribe anytime.{" "}
                                <span className="text-primary">Privacy-first</span>, always.
                            </p>
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default NewsletterSection;
