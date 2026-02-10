import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Download,
    Users,
    Eye,
    TrendingUp,
    MessageSquareQuote,
    HelpCircle,
    FileText,
    ArrowUpRight,
    Activity,
    Mail,
    Monitor,
    Apple,
    Clock,
    MoreHorizontal,
    Calendar,
    Terminal,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboardStats } from "@/hooks/useAnalytics";

// Sparkline component for mini charts
const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
    if (!data.length) return null;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 80;
    const height = 32;

    const points = data
        .map((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * height;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <svg width={width} height={height} className="overflow-visible">
            <defs>
                <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
            <polygon
                fill={`url(#gradient-${color})`}
                points={`0,${height} ${points} ${width},${height}`}
            />
        </svg>
    );
};

// Animated counter component
const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
    return (
        <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="tabular-nums"
        >
            {value.toLocaleString()}{suffix}
        </motion.span>
    );
};

const quickActions = [
    {
        title: "Add Testimonial",
        description: "Create customer reviews",
        href: "/admin/testimonials",
        icon: MessageSquareQuote,
        gradient: "from-pink-500/20 to-rose-500/20",
        iconColor: "text-pink-500"
    },
    {
        title: "Manage FAQ",
        description: "Update help content",
        href: "/admin/faq",
        icon: HelpCircle,
        gradient: "from-blue-500/20 to-cyan-500/20",
        iconColor: "text-blue-500"
    },
    {
        title: "New Release",
        description: "Add version notes",
        href: "/admin/changelog",
        icon: FileText,
        gradient: "from-violet-500/20 to-purple-500/20",
        iconColor: "text-violet-500"
    },
];

// Activity types with specific styling
const activityTypes = {
    subscriber: { icon: Mail, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    download: { icon: Download, color: "text-blue-500", bg: "bg-blue-500/10" },
    pageview: { icon: Eye, color: "text-violet-500", bg: "bg-violet-500/10" },
};

const AdminDashboard = () => {
    const { data: dashboardStats, isLoading } = useDashboardStats();

    // Build stats from real data
    const stats = [
        {
            title: "Total Downloads",
            value: dashboardStats?.downloads || 0,
            change: "-",
            trend: "up",
            icon: Download,
            color: "from-blue-500 to-cyan-500",
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-500",
            sparklineData: [],
            sparklineColor: "#3b82f6"
        },
        {
            title: "Subscribers",
            value: dashboardStats?.subscribers || 0,
            change: "-",
            trend: "up",
            icon: Users,
            color: "from-emerald-500 to-teal-500",
            iconBg: "bg-emerald-500/10",
            iconColor: "text-emerald-500",
            sparklineData: [],
            sparklineColor: "#10b981"
        },
        {
            title: "Page Views",
            value: dashboardStats?.pageViews || 0,
            change: "-",
            trend: "up",
            icon: Eye,
            color: "from-violet-500 to-purple-500",
            iconBg: "bg-violet-500/10",
            iconColor: "text-violet-500",
            sparklineData: [],
            sparklineColor: "#8b5cf6"
        },
        {
            title: "Live Users",
            value: dashboardStats?.liveUsers || 0,
            change: "Active now",
            trend: "up",
            icon: Activity,
            color: "from-red-500 to-orange-500",
            iconBg: "bg-red-500/10",
            iconColor: "text-red-500",
            sparklineData: [],
            sparklineColor: "#ef4444",
            isLive: true
        },
    ];

    // Platform breakdown - calculated from downloads if available
    const platformBreakdown = [
        { name: "Windows", value: 0, color: "#3b82f6", icon: Monitor },
        { name: "macOS", value: 0, color: "#6b7280", icon: Apple },
        { name: "Linux", value: 0, color: "#f97316", icon: Terminal },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                    >
                        Dashboard
                    </motion.h1>
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary flex items-center gap-1"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Live
                    </motion.span>
                </div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground flex items-center gap-2"
                >
                    <Calendar className="h-4 w-4" />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </motion.p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5"
                    >
                        {/* Live indicator */}
                        {stat.isLive && (
                            <div className="absolute top-2 right-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            </div>
                        )}

                        {/* Gradient background on hover */}
                        <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                            `bg-gradient-to-br ${stat.color}`
                        )} style={{ opacity: 0.05 }} />

                        <div className="relative">
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn("rounded-xl p-2.5", stat.iconBg)}>
                                    <stat.icon className={cn("h-5 w-5", stat.iconColor)} />
                                </div>
                                {!stat.isLive && (
                                    <span
                                        className={cn(
                                            "flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-1",
                                            stat.trend === "up"
                                                ? "bg-emerald-500/10 text-emerald-500"
                                                : "bg-red-500/10 text-red-500"
                                        )}
                                    >
                                        <TrendingUp className={cn("h-3 w-3", stat.trend === "down" && "rotate-180")} />
                                        {stat.change}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-3xl font-bold text-foreground">
                                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                                </div>
                                {stat.sparklineData.length > 0 && (
                                    <Sparkline data={stat.sparklineData} color={stat.sparklineColor} />
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="lg:col-span-1 space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
                    </div>

                    <div className="space-y-3">
                        {quickActions.map((action, index) => (
                            <motion.div
                                key={action.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                            >
                                <Link to={action.href}>
                                    <div className={cn(
                                        "group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-4",
                                        "hover:border-primary/30 transition-all duration-300"
                                    )}>
                                        <div className={cn(
                                            "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                                            action.gradient
                                        )} />

                                        <div className="relative flex items-center gap-4">
                                            <div className="rounded-xl bg-background/80 p-2.5 border border-border/50 group-hover:border-primary/30 transition-colors">
                                                <action.icon className={cn("h-5 w-5", action.iconColor)} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                    {action.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {action.description}
                                                </p>
                                            </div>
                                            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Platform Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="rounded-xl border border-border/50 bg-card/50 p-5"
                    >
                        <h3 className="font-semibold text-foreground mb-4">Platform Breakdown</h3>
                        <div className="space-y-4">
                            {platformBreakdown.map((platform) => (
                                <div key={platform.name} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <platform.icon className="h-4 w-4" style={{ color: platform.color }} />
                                            <span className="text-muted-foreground">{platform.name}</span>
                                        </div>
                                        <span className="font-semibold text-foreground">{platform.value}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${platform.value}%` }}
                                            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: platform.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                            <p className="text-xs text-muted-foreground text-center mt-4">
                                Platform data will populate as downloads occur
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Summary Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="lg:col-span-2 rounded-xl border border-border/50 bg-card/50 p-5"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <Activity className="h-4 w-4 text-primary" />
                            </div>
                            <h2 className="text-lg font-semibold text-foreground">Summary</h2>
                        </div>
                        <Link to="/admin/analytics">
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                                View Analytics
                                <ArrowUpRight className="ml-1 h-3 w-3" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg bg-muted/30 p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="rounded-lg bg-blue-500/10 p-2">
                                    <Download className="h-4 w-4 text-blue-500" />
                                </div>
                                <span className="text-sm text-muted-foreground">Total Downloads</span>
                            </div>
                            <p className="text-2xl font-bold">{(dashboardStats?.downloads || 0).toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground mt-1">All time from all platforms</p>
                        </div>

                        <div className="rounded-lg bg-muted/30 p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="rounded-lg bg-emerald-500/10 p-2">
                                    <Users className="h-4 w-4 text-emerald-500" />
                                </div>
                                <span className="text-sm text-muted-foreground">Newsletter Subscribers</span>
                            </div>
                            <p className="text-2xl font-bold">{(dashboardStats?.subscribers || 0).toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground mt-1">Active subscribers</p>
                        </div>

                        <div className="rounded-lg bg-muted/30 p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="rounded-lg bg-violet-500/10 p-2">
                                    <Eye className="h-4 w-4 text-violet-500" />
                                </div>
                                <span className="text-sm text-muted-foreground">Total Page Views</span>
                            </div>
                            <p className="text-2xl font-bold">{(dashboardStats?.pageViews || 0).toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground mt-1">Tracked since launch</p>
                        </div>

                        <div className="rounded-lg bg-muted/30 p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="rounded-lg bg-red-500/10 p-2">
                                    <Activity className="h-4 w-4 text-red-500" />
                                </div>
                                <span className="text-sm text-muted-foreground">Live Users</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold">{dashboardStats?.liveUsers || 0}</p>
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Active in last 5 minutes</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
