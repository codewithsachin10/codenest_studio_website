import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Code2, Mail, Lock, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const AdminLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn, isConfigured } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/admin";

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setError(null);

        // Demo mode - allow any login when Supabase is not configured
        if (!isConfigured) {
            navigate(from, { replace: true });
            return;
        }

        const { error } = await signIn(data.email, data.password);

        if (error) {
            setError(error.message);
        } else {
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                {/* Back to site link */}
                <Link
                    to="/"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to website
                </Link>

                <div className="rounded-xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm">
                    {/* Logo */}
                    <div className="mb-8 flex flex-col items-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                            <Code2 className="h-7 w-7 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Sign in to access the admin dashboard
                        </p>
                    </div>

                    {/* Demo Mode Notice */}
                    {!isConfigured && (
                        <div className="mb-6 rounded-lg bg-yellow-500/10 p-4 text-sm text-yellow-500">
                            <p className="font-medium">Demo Mode Active</p>
                            <p className="mt-1 text-yellow-500/80">
                                Supabase is not configured. Enter any credentials to access the demo.
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-sm text-destructive"
                        >
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@codenest.studio"
                                    className={cn(
                                        "pl-10",
                                        errors.email && "border-destructive focus-visible:ring-destructive"
                                    )}
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className={cn(
                                        "pl-10",
                                        errors.password && "border-destructive focus-visible:ring-destructive"
                                    )}
                                    {...register("password")}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-destructive">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            variant="hero"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} CodeNest Studio. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
