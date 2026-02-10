import { useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Eye,
    Download,
    Users,
    Calendar,
    ArrowUpRight,
    Monitor,
    Apple,
    Terminal,
    FileDown,
    Loader2,
    Activity,
} from "lucide-react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/hooks/useAnalytics";

const timeRanges = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "12m", label: "Last 12 months" },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-border/50 bg-card/95 backdrop-blur-sm p-3 shadow-xl">
                <p className="text-sm font-medium text-foreground mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-xs" style={{ color: entry.color }}>
                        {entry.name}: {entry.value.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const AnalyticsPage = () => {
    const [timeRange, setTimeRange] = useState("30d");
    const { data: analytics, isLoading } = useAnalytics(timeRange);

    // Derive chart data from analytics
    const downloadsByPlatform = analytics?.downloadsByPlatform || [];

    // Calculate percentages for pie chart
    const totalDownloads = analytics?.downloads || 1; // Prevent division by zero
    const pieData = downloadsByPlatform.map(p => {
        let color = "#6b7280"; // Default
        if (p.platform === "windows") color = "#3b82f6";
        if (p.platform === "macos") color = "#000000"; // Black/Dark for Mac
        if (p.platform === "linux") color = "#f97316";

        return {
            name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
            value: Math.round((p.count / totalDownloads) * 100),
            color
        };
    });

    // Stats from analytics
    const stats = [
        {
            title: "Live Users",
            value: analytics?.liveUsers || 0,
            change: "Active now",
            trend: "neutral",
            icon: Activity,
            color: "text-red-500",
            bg: "bg-red-500/10",
            isLive: true,
        },
        {
            title: "Page Views",
            value: analytics?.pageViews.toLocaleString() || "0",
            change: `${analytics?.pageViewsChange || 0}%`,
            trend: (analytics?.pageViewsChange || 0) >= 0 ? "up" : "down",
            icon: Eye,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Downloads",
            value: analytics?.downloads.toLocaleString() || "0",
            change: `${analytics?.downloadsChange || 0}%`,
            trend: (analytics?.downloadsChange || 0) >= 0 ? "up" : "down",
            icon: Download,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Subscribers",
            value: analytics?.subscribers.toLocaleString() || "0",
            change: `${analytics?.subscribersChange || 0}%`,
            trend: (analytics?.subscribersChange || 0) >= 0 ? "up" : "down",
            icon: Users,
            color: "text-violet-500",
            bg: "bg-violet-500/10",
        },
    ];

    const pageViewsData = analytics?.recentPageViews || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-foreground flex items-center gap-3"
                    >
                        <div className="rounded-xl bg-primary/10 p-2">
                            <BarChart3 className="h-6 w-6 text-primary" />
                        </div>
                        Analytics
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-1"
                    >
                        Track website performance and user engagement
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3"
                >
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-44 bg-background/50">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {timeRanges.map((range) => (
                                <SelectItem key={range.value} value={range.value}>
                                    {range.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2">
                        <FileDown className="h-4 w-4" />
                        Export
                    </Button>
                </motion.div>
            </div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + index * 0.05 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="rounded-xl border border-border/50 bg-card/50 p-5 relative overflow-hidden"
                    >
                        {stat.isLive && (
                            <div className="absolute top-0 right-0 p-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            </div>
                        )}
                        <div className="flex items-center justify-between mb-3">
                            <div className={cn("rounded-lg p-2.5", stat.bg)}>
                                <stat.icon className={cn("h-5 w-5", stat.color)} />
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
                                    {stat.trend === "up" ? (
                                        <TrendingUp className="h-3 w-3" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3" />
                                    )}
                                    {stat.change}
                                </span>
                            )}
                            {stat.isLive && (
                                <span className="text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-full">
                                    LIVE
                                </span>
                            )}
                        </div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Row 1 */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Page Views Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 rounded-xl border border-border/50 bg-card/50 p-5"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-foreground">Traffic Overview</h3>
                            <p className="text-sm text-muted-foreground">Page views vs unique visitors</p>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={pageViewsData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => value > 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    fill="url(#colorViews)"
                                    name="Page Views"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Platform Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="rounded-xl border border-border/50 bg-card/50 p-5"
                >
                    <h3 className="font-semibold text-foreground mb-6">Platform Distribution</h3>
                    <div className="h-48 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={75}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                        {pieData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-3 w-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-muted-foreground">{item.name}</span>
                                </div>
                                <span className="font-semibold text-foreground">{item.value}%</span>
                            </div>
                        ))}
                        {pieData.length === 0 && (
                            <div className="text-center text-muted-foreground text-sm">
                                No download data available yet
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Downloads List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-border/50 bg-card/50 p-5"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-semibold text-foreground">Downloads by Platform</h3>
                        <p className="text-sm text-muted-foreground">Detailed breakdown</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {downloadsByPlatform.map((platform, index) => {
                        let icon = Monitor;
                        let color = "#3b82f6";
                        if (platform.platform === "macos") { icon = Apple; color = "#000000"; }
                        if (platform.platform === "linux") { icon = Terminal; color = "#f97316"; }

                        const Icon = icon;

                        return (
                            <motion.div
                                key={platform.platform}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.35 + index * 0.05 }}
                                className="flex items-center gap-4"
                            >
                                <div
                                    className="rounded-lg p-2.5"
                                    style={{ backgroundColor: `${color}15` }}
                                >
                                    <Icon className="h-5 w-5" style={{ color: color }} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="font-medium text-foreground capitalize">{platform.platform}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-foreground">
                                                {platform.count.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(platform.count / (analytics?.downloads || 1)) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    {downloadsByPlatform.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                            No downloads recorded yet
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AnalyticsPage;
