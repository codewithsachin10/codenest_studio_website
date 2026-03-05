import { useState } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    GripVertical,
    Edit3,
    Trash2,
    MoreVertical,
    Map,
    CircleDot,
    Clock,
    CheckCircle,
    Target,
    Calendar,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import {
    useRoadmap,
    useCreateRoadmapItem,
    useUpdateRoadmapItem,
    useDeleteRoadmapItem,
    useUpdateRoadmapOrder,
} from "@/hooks/useRoadmap";

interface RoadmapItem {
    id: string;
    title: string;
    description: string | null;
    status: "in-progress" | "planned" | "completed";
    quarter: string | null;
    order_index: number;
    created_at: string;
}

const statusConfig = {
    "in-progress": {
        label: "In Progress",
        icon: CircleDot,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
    },
    planned: {
        label: "Planned",
        icon: Clock,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
    },
    completed: {
        label: "Completed",
        icon: CheckCircle,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
    },
};

const RoadmapPage = () => {
    const { data: items = [], isLoading } = useRoadmap();
    const createItem = useCreateRoadmapItem();
    const updateItem = useUpdateRoadmapItem();
    const deleteItem = useDeleteRoadmapItem();
    const updateOrder = useUpdateRoadmapOrder();

    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "planned" as RoadmapItem["status"],
        quarter: "Q1 2025",
    });

    // Filter items
    const filteredItems = items.filter((item) => {
        return (
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Group by status
    const inProgressItems = filteredItems
        .filter((i) => i.status === "in-progress")
        .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
    const plannedItems = filteredItems
        .filter((i) => i.status === "planned")
        .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
    const completedItems = filteredItems
        .filter((i) => i.status === "completed")
        .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

    // Stats
    const stats = {
        total: items.length,
        inProgress: items.filter((i) => i.status === "in-progress").length,
        planned: items.filter((i) => i.status === "planned").length,
        completed: items.filter((i) => i.status === "completed").length,
    };

    const handleCreate = () => {
        setEditingItem(null);
        setFormData({
            title: "",
            description: "",
            status: "planned",
            quarter: "Q1 2025",
        });
        setIsDialogOpen(true);
    };

    const handleEdit = (item: RoadmapItem) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            description: item.description || "",
            status: item.status,
            quarter: item.quarter || "Q1 2025",
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        deleteItem.mutate(id);
    };

    const handleStatusChange = (id: string, status: RoadmapItem["status"]) => {
        updateItem.mutate({ id, status });
    };

    const handleReorder = (newOrder: RoadmapItem[], status: RoadmapItem["status"]) => {
        const updates = newOrder.map((item, index) => ({
            id: item.id,
            order_index: index,
            status,
        }));
        updateOrder.mutate(updates);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingItem) {
            updateItem.mutate(
                { id: editingItem.id, ...formData },
                { onSuccess: () => setIsDialogOpen(false) }
            );
        } else {
            createItem.mutate(
                {
                    ...formData,
                    order_index: items.filter((i) => i.status === formData.status).length,
                },
                { onSuccess: () => setIsDialogOpen(false) }
            );
        }
    };

    const RoadmapCard = ({ item }: { item: RoadmapItem }) => {
        const config = statusConfig[item.status] || statusConfig.planned;
        return (
            <motion.div
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className={cn(
                    "group rounded-xl border bg-card/50 backdrop-blur-sm p-4 cursor-grab active:cursor-grabbing transition-all",
                    "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                    config.border
                )}
            >
                <div className="flex items-start gap-3">
                    <div className="text-muted-foreground hover:text-foreground transition-colors mt-0.5">
                        <GripVertical className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">{item.title}</h3>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEdit(item)}>
                                        <Edit3 className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {item.status !== "in-progress" && (
                                        <DropdownMenuItem onClick={() => handleStatusChange(item.id, "in-progress")}>
                                            <CircleDot className="mr-2 h-4 w-4 text-blue-500" />
                                            Move to In Progress
                                        </DropdownMenuItem>
                                    )}
                                    {item.status !== "planned" && (
                                        <DropdownMenuItem onClick={() => handleStatusChange(item.id, "planned")}>
                                            <Clock className="mr-2 h-4 w-4 text-amber-500" />
                                            Move to Planned
                                        </DropdownMenuItem>
                                    )}
                                    {item.status !== "completed" && (
                                        <DropdownMenuItem onClick={() => handleStatusChange(item.id, "completed")}>
                                            <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                                            Mark Complete
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {item.description}
                        </p>

                        {item.quarter && (
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
                                    config.bg,
                                    config.color
                                )}>
                                    <Calendar className="h-3 w-3" />
                                    {item.quarter}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    const StatusColumn = ({
        status,
        items,
        title,
    }: {
        status: RoadmapItem["status"];
        items: RoadmapItem[];
        title: string;
    }) => {
        const config = statusConfig[status];
        return (
            <div className="flex flex-col">
                <div className={cn(
                    "flex items-center gap-3 mb-4 p-3 rounded-xl",
                    config.bg
                )}>
                    <div className={cn("rounded-lg p-2", config.bg)}>
                        <config.icon className={cn("h-5 w-5", config.color)} />
                    </div>
                    <div>
                        <h3 className={cn("font-semibold", config.color)}>{title}</h3>
                        <p className="text-xs text-muted-foreground">{items.length} item{items.length !== 1 && "s"}</p>
                    </div>
                </div>

                <div className="flex-1 rounded-xl border border-border/50 bg-muted/20 p-3 min-h-[200px]">
                    <Reorder.Group
                        axis="y"
                        values={items}
                        onReorder={(newOrder) => handleReorder(newOrder, status)}
                        className="space-y-3"
                    >
                        <AnimatePresence mode="popLayout">
                            {items.map((item, index) => (
                                <Reorder.Item
                                    key={item.id}
                                    value={item}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    <RoadmapCard item={item} />
                                </Reorder.Item>
                            ))}
                        </AnimatePresence>
                    </Reorder.Group>

                    {items.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-32 text-center">
                            <div className="rounded-full bg-muted/50 p-3 mb-2">
                                <Target className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground">No items</p>
                        </div>
                    )}
                </div>
            </div>
        );
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
                            <Map className="h-6 w-6 text-primary" />
                        </div>
                        Roadmap
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-1"
                    >
                        Plan and track upcoming features
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Button onClick={handleCreate} className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25">
                        <Plus className="h-4 w-4" />
                        Add Item
                    </Button>
                </motion.div>
            </div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid gap-4 sm:grid-cols-4"
            >
                {[
                    { label: "Total Items", value: stats.total, icon: Target, color: "text-violet-500", bg: "bg-violet-500/10" },
                    { label: "In Progress", value: stats.inProgress, icon: CircleDot, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Planned", value: stats.planned, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
                    { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
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

            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search roadmap..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background/50"
                    />
                </div>
            </motion.div>

            {/* Kanban Board */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid gap-4 md:grid-cols-3"
            >
                <StatusColumn status="in-progress" items={inProgressItems} title="In Progress" />
                <StatusColumn status="planned" items={plannedItems} title="Planned" />
                <StatusColumn status="completed" items={completedItems} title="Completed" />
            </motion.div>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <Map className="h-4 w-4 text-primary" />
                            </div>
                            {editingItem ? "Edit Item" : "Add Item"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingItem ? "Update the roadmap item" : "Add a new roadmap item"}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Feature name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the feature..."
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, status: value as RoadmapItem["status"] })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="planned">Planned</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quarter">Target Quarter</Label>
                                <Select
                                    value={formData.quarter}
                                    onValueChange={(value) => setFormData({ ...formData, quarter: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Q1 2025">Q1 2025</SelectItem>
                                        <SelectItem value="Q2 2025">Q2 2025</SelectItem>
                                        <SelectItem value="Q3 2025">Q3 2025</SelectItem>
                                        <SelectItem value="Q4 2025">Q4 2025</SelectItem>
                                        <SelectItem value="Q1 2026">Q1 2026</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-primary to-primary/80"
                                disabled={createItem.isPending || updateItem.isPending}
                            >
                                {(createItem.isPending || updateItem.isPending) && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {editingItem ? "Save Changes" : "Create Item"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RoadmapPage;
