import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    MessageSquareQuote,
    HelpCircle,
    History,
    Sparkles,
    Rocket,
    Users,
    Download,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Code2,
    ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const navItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Content",
        icon: MessageSquareQuote,
        children: [
            { title: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
            { title: "FAQ", href: "/admin/faq", icon: HelpCircle },
            { title: "Changelog", href: "/admin/changelog", icon: History },
            { title: "Features", href: "/admin/features", icon: Sparkles },
            { title: "Roadmap", href: "/admin/roadmap", icon: Rocket },
        ],
    },
    {
        title: "Subscribers",
        href: "/admin/subscribers",
        icon: Users,
    },
    {
        title: "Downloads",
        href: "/admin/downloads",
        icon: Download,
    },
    {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

const NavItem = ({
    item,
    isActive,
    isSidebarOpen,
}: {
    item: (typeof navItems)[0];
    isActive: boolean;
    isSidebarOpen: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    if (item.children) {
        const isChildActive = item.children.some(
            (child) => location.pathname === child.href
        );

        return (
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isChildActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-surface hover:text-foreground"
                    )}
                >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {isSidebarOpen && (
                        <>
                            <span className="flex-1 text-left">{item.title}</span>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 transition-transform",
                                    isOpen && "rotate-180"
                                )}
                            />
                        </>
                    )}
                </button>
                <AnimatePresence>
                    {isOpen && isSidebarOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="ml-4 mt-1 space-y-1 border-l border-border/50 pl-4">
                                {item.children.map((child) => (
                                    <Link
                                        key={child.href}
                                        to={child.href}
                                        className={cn(
                                            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                                            location.pathname === child.href
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-surface hover:text-foreground"
                                        )}
                                    >
                                        <child.icon className="h-4 w-4" />
                                        {child.title}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <Link
            to={item.href!}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
            )}
        >
            <item.icon className="h-5 w-5 shrink-0" />
            {isSidebarOpen && <span>{item.title}</span>}
        </Link>
    );
};

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        navigate("/admin/login");
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 md:flex",
                    sidebarOpen ? "w-64" : "w-20"
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
                    <Link to="/admin" className="flex items-center gap-2">
                        <Code2 className="h-6 w-6 text-primary" />
                        {sidebarOpen && (
                            <span className="font-semibold text-foreground">Admin</span>
                        )}
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="h-8 w-8"
                    >
                        <Menu className="h-4 w-4" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.title}
                            item={item}
                            isActive={location.pathname === item.href}
                            isSidebarOpen={sidebarOpen}
                        />
                    ))}
                </nav>

                {/* User & Logout */}
                <div className="border-t border-border/50 p-4">
                    {sidebarOpen && user && (
                        <p className="mb-2 truncate text-xs text-muted-foreground">
                            {user.email}
                        </p>
                    )}
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                        onClick={handleSignOut}
                    >
                        <LogOut className="h-5 w-5" />
                        {sidebarOpen && "Logout"}
                    </Button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-md md:hidden">
                <Link to="/admin" className="flex items-center gap-2">
                    <Code2 className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-foreground">Admin</span>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-background pt-16 md:hidden"
                    >
                        <nav className="space-y-1 p-4">
                            {navItems.map((item) => (
                                <NavItem
                                    key={item.title}
                                    item={item}
                                    isActive={location.pathname === item.href}
                                    isSidebarOpen={true}
                                />
                            ))}
                        </nav>
                        <div className="border-t border-border/50 p-4">
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                                onClick={handleSignOut}
                            >
                                <LogOut className="h-5 w-5" />
                                Logout
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main
                className={cn(
                    "flex-1 pt-16 transition-all duration-300 md:pt-0",
                    sidebarOpen ? "md:ml-64" : "md:ml-20"
                )}
            >
                <div className="container mx-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
