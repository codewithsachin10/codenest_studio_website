import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Trash2,
    Filter,
    Users,
    Calendar,
    MoreVertical,
    CheckCircle,
    XCircle,
    Clock,
    ChevronLeft,
    ChevronRight,
    X,
    FileSpreadsheet,
    UserMinus,
    UserCheck,
    ArrowUpDown,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    useSubscribers,
    useSubscriberStats,
    useUpdateSubscriberStatus,
    useDeleteSubscriber,
    useBulkDeleteSubscribers,
} from "@/hooks/useSubscribers";

const statusConfig = {
    active: { label: "Active", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", dot: "bg-emerald-500" },
    unsubscribed: { label: "Unsubscribed", icon: XCircle, color: "text-gray-500", bg: "bg-gray-500/10", dot: "bg-gray-500" },
};

const SubscribersPage = () => {
    const { data: subscribers = [], isLoading } = useSubscribers();
    const { data: stats } = useSubscriberStats();
    const updateStatus = useUpdateSubscriberStatus();
    const deleteSubscriber = useDeleteSubscriber();
    const bulkDelete = useBulkDeleteSubscribers();

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [sortField, setSortField] = useState<"email" | "subscribed_at">("subscribed_at");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter and sort subscribers
    const filteredSubscribers = subscribers
        .filter((s) => {
            const matchesSearch = s.email?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === "all" || s.status === filterStatus;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const aVal = a[sortField] || "";
            const bVal = b[sortField] || "";
            const comparison = String(aVal).localeCompare(String(bVal));
            return sortDirection === "asc" ? comparison : -comparison;
        });

    // Pagination
    const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
    const paginatedSubscribers = filteredSubscribers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (field: typeof sortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.size === paginatedSubscribers.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(paginatedSubscribers.map((s) => s.id)));
        }
    };

    const handleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleBulkDelete = () => {
        bulkDelete.mutate(Array.from(selectedIds), {
            onSuccess: () => setSelectedIds(new Set()),
        });
    };

    const handleStatusChange = (id: string, status: "active" | "unsubscribed") => {
        updateStatus.mutate({ id, status });
    };

    const handleExport = () => {
        const csv = [
            ["Email", "Status", "Subscribed Date"].join(","),
            ...subscribers.map((s) => [s.email, s.status, s.subscribed_at].join(",")),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "subscribers.csv";
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Export complete");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

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
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        Subscribers
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-1"
                    >
                        Manage your email subscriber list
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Button onClick={handleExport} variant="outline" className="gap-2" disabled={subscribers.length === 0}>
                        <FileSpreadsheet className="h-4 w-4" />
                        Export CSV
                    </Button>
                </motion.div>
            </div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid gap-4 sm:grid-cols-3"
            >
                {[
                    { label: "Total Subscribers", value: stats?.total || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Active", value: stats?.active || 0, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "Unsubscribed", value: stats?.unsubscribed || 0, icon: XCircle, color: "text-gray-500", bg: "bg-gray-500/10" },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + index * 0.05 }}
                        className="rounded-xl border border-border/50 bg-card/50 p-4 flex items-center gap-4"
                    >
                        <div className={cn("rounded-lg p-2.5", stat.bg)}>
                            <stat.icon className={cn("h-5 w-5", stat.color)} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Toolbar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div className="flex flex-1 items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-background/50"
                        />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-40 bg-background/50">
                            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Bulk Actions */}
                <AnimatePresence>
                    {selectedIds.size > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 border border-primary/20"
                        >
                            <span className="text-sm font-medium text-primary">
                                {selectedIds.size} selected
                            </span>
                            <div className="h-4 w-px bg-primary/20" />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-destructive hover:text-destructive"
                                onClick={handleBulkDelete}
                                disabled={bulkDelete.isPending}
                            >
                                {bulkDelete.isPending ? (
                                    <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                                ) : (
                                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                                )}
                                Delete
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2"
                                onClick={() => setSelectedIds(new Set())}
                            >
                                <X className="h-3.5 w-3.5 mr-1" />
                                Clear
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-border/50 bg-card/50 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/50 bg-muted/30">
                                <th className="px-4 py-3 text-left">
                                    <Checkbox
                                        checked={selectedIds.size === paginatedSubscribers.length && paginatedSubscribers.length > 0}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 font-semibold text-muted-foreground hover:text-foreground"
                                        onClick={() => handleSort("email")}
                                    >
                                        Email
                                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
                                    </Button>
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <span className="font-semibold text-muted-foreground text-sm">Status</span>
                                </th>
                                <th className="px-4 py-3 text-left">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 font-semibold text-muted-foreground hover:text-foreground"
                                        onClick={() => handleSort("subscribed_at")}
                                    >
                                        Subscribed
                                        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
                                    </Button>
                                </th>
                                <th className="px-4 py-3 text-right">
                                    <span className="font-semibold text-muted-foreground text-sm">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {paginatedSubscribers.map((subscriber, index) => {
                                    const config = statusConfig[subscriber.status as keyof typeof statusConfig] || statusConfig.active;
                                    return (
                                        <motion.tr
                                            key={subscriber.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: index * 0.02 }}
                                            className={cn(
                                                "border-b border-border/30 transition-colors",
                                                selectedIds.has(subscriber.id) ? "bg-primary/5" : "hover:bg-muted/30"
                                            )}
                                        >
                                            <td className="px-4 py-3">
                                                <Checkbox
                                                    checked={selectedIds.has(subscriber.id)}
                                                    onCheckedChange={() => handleSelect(subscriber.id)}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                                                        <span className="text-xs font-semibold text-primary-foreground">
                                                            {subscriber.email?.[0]?.toUpperCase() || "?"}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-medium text-foreground">{subscriber.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                                                    config.bg,
                                                    config.color
                                                )}>
                                                    <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
                                                    {config.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {formatDate(subscriber.subscribed_at || "")}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {subscriber.status !== "active" && (
                                                            <DropdownMenuItem onClick={() => handleStatusChange(subscriber.id, "active")}>
                                                                <UserCheck className="mr-2 h-4 w-4" />
                                                                Mark Active
                                                            </DropdownMenuItem>
                                                        )}
                                                        {subscriber.status === "active" && (
                                                            <DropdownMenuItem onClick={() => handleStatusChange(subscriber.id, "unsubscribed")}>
                                                                <UserMinus className="mr-2 h-4 w-4" />
                                                                Unsubscribe
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => deleteSubscriber.mutate(subscriber.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 bg-muted/20">
                        <span className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + 1}-
                            {Math.min(currentPage * itemsPerPage, filteredSubscribers.length)} of {filteredSubscribers.length}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Empty State */}
            {filteredSubscribers.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                >
                    <div className="rounded-2xl bg-muted/30 p-6 mb-4">
                        <Users className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No subscribers found</h3>
                    <p className="text-muted-foreground">
                        {searchQuery ? "Try adjusting your search" : "Your subscriber list is empty"}
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default SubscribersPage;
