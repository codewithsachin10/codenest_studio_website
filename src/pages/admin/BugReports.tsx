import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bug,
    Search,
    MessageSquare,
    Filter,
    MoreVertical,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Clock,
    Image as ImageIcon,
    Mail,
    X,
    Monitor,
    Globe,
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useBugReports, useUpdateBugReport, useDeleteBugReport } from "@/hooks/useBugReports";
import { formatDistanceToNow } from "date-fns";

const statusConfig = {
    new: { label: "New", color: "text-blue-500", bg: "bg-blue-500/10", icon: AlertCircle },
    investigating: { label: "Investigating", color: "text-amber-500", bg: "bg-amber-500/10", icon: Clock },
    resolved: { label: "Resolved", color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 },
};

const AdminBugReports = () => {
    const { data: reports = [], isLoading } = useBugReports();
    const updateReport = useUpdateBugReport();
    const deleteReport = useDeleteBugReport();

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    const filteredReports = reports.filter((r) => {
        const matchesSearch =
            r.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.user_email?.toLowerCase() || "").includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleStatusChange = (id: string, newStatus: any) => {
        updateReport.mutate({ id, status: newStatus });
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this ticket?")) {
            deleteReport.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Bug className="h-8 w-8 text-primary opacity-50" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-foreground flex items-center gap-3"
                    >
                        <div className="rounded-xl bg-rose-500/10 p-2 border border-rose-500/20">
                            <Bug className="h-6 w-6 text-rose-500" />
                        </div>
                        Feedback & Bug Reports
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-1"
                    >
                        Review issues and suggestions submitted by users.
                    </motion.p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search tickets by email or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background/50 border-border/50"
                    />
                </div>
                <div className="flex gap-2">
                    {["all", "new", "investigating", "resolved"].map((status) => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? "secondary" : "outline"}
                            size="sm"
                            className="h-9"
                            onClick={() => setStatusFilter(status)}
                        >
                            {status === "all" ? "All" : statusConfig[status as keyof typeof statusConfig]?.label}
                        </Button>
                    ))}
                </div>
            </motion.div>

            <AnimatePresence mode="popLayout">
                <div className="grid gap-4">
                    {filteredReports.length === 0 ? (
                        <div className="text-center py-20 border border-border/50 rounded-2xl bg-card/10 backdrop-blur-sm">
                            <Bug className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium text-foreground">Inbox Zero!</h3>
                            <p className="text-muted-foreground">No reports found matching your criteria.</p>
                        </div>
                    ) : (
                        filteredReports.map((report, index) => {
                            const status = statusConfig[report.status as keyof typeof statusConfig] || statusConfig.new;
                            const StatusIcon = status.icon;

                            return (
                                <motion.div
                                    key={report.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        "group relative flex flex-col md:flex-row gap-4 p-5 rounded-xl border transition-all duration-300",
                                        "bg-card/40 hover:bg-card/80 border-white/5 hover:border-white/10"
                                    )}
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: status.color.replace('text-', '') }} />

                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={cn("border-none capitalize", report.type === 'bug' ? 'bg-rose-500/10 text-rose-500' : 'bg-primary/10 text-primary')}>
                                                    {report.type}
                                                </Badge>
                                                <Badge variant="outline" className={cn("border-none flex items-center gap-1", status.bg, status.color)}>
                                                    <StatusIcon className="h-3 w-3" />
                                                    {status.label}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground ml-2">
                                                    {formatDistanceToNow(new Date(report.created_at || new Date()), { addSuffix: true })}
                                                </span>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleStatusChange(report.id, "new")}>
                                                        <AlertCircle className="mr-2 h-4 w-4 text-blue-500" /> Mark New
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(report.id, "investigating")}>
                                                        <Clock className="mr-2 h-4 w-4 text-amber-500" /> Mark Investigating
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(report.id, "resolved")}>
                                                        <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" /> Mark Resolved
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(report.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Ticket
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <p className="text-sm text-foreground leading-relaxed mt-2 whitespace-pre-wrap">
                                            {report.content}
                                        </p>

                                        {report.image_url && (
                                            <div className="mt-3 overflow-hidden rounded-lg border border-border/50 inline-block">
                                                <img 
                                                    src={report.image_url} 
                                                    alt="Bug Attachment" 
                                                    className="max-h-[120px] object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                                    onClick={() => setExpandedImage(report.image_url)}
                                                />
                                            </div>
                                        )}

                                        {(report.user_email || report.metadata) && (
                                            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/50">
                                                {report.user_email && (
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer w-fit">
                                                        <Mail className="h-3.5 w-3.5" />
                                                        <a href={`mailto:${report.user_email}`}>{report.user_email}</a>
                                                    </div>
                                                )}
                                                
                                                {/* System Diagnostics Metadata */}
                                                {report.metadata && typeof report.metadata === 'object' && (
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        {(report.metadata as any).userAgent && (
                                                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/20 border border-white/5 text-[10px] text-muted-foreground" title={(report.metadata as any).userAgent}>
                                                                <Monitor className="h-3 w-3" />
                                                                <span className="truncate max-w-[150px]">
                                                                    {((report.metadata as any).userAgent.includes('Win') ? 'Windows' : 
                                                                    (report.metadata as any).userAgent.includes('Mac') ? 'macOS' : 
                                                                    (report.metadata as any).userAgent.includes('Linux') ? 'Linux' : 'Unknown OS')}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {(report.metadata as any).windowWidth && (
                                                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/20 border border-white/5 text-[10px] text-muted-foreground">
                                                                <Activity className="h-3 w-3" />
                                                                <span>{(report.metadata as any).windowWidth}x{(report.metadata as any).windowHeight}</span>
                                                            </div>
                                                        )}
                                                        {(report.metadata as any).url && (
                                                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/20 border border-white/5 text-[10px] text-muted-foreground" title={(report.metadata as any).url}>
                                                                <Globe className="h-3 w-3" />
                                                                <span className="truncate max-w-[120px]">{(report.metadata as any).url.replace(/^https?:\/\//, '')}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </AnimatePresence>

            <Dialog open={!!expandedImage} onOpenChange={() => setExpandedImage(null)}>
                <DialogContent className="max-w-4xl bg-black/90 border-white/10 p-0 overflow-hidden">
                    <DialogHeader className="p-4 border-b border-white/10 flex flex-row items-center justify-between">
                        <DialogTitle className="text-white">Attachment Viewer</DialogTitle>
                    </DialogHeader>
                    {expandedImage && (
                         <div className="w-full flex justify-center items-center bg-black p-4">
                            <img src={expandedImage} alt="Expanded Attachment" className="max-w-full max-h-[80vh] object-contain rounded-md" />
                         </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminBugReports;
