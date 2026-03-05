import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Sparkles,
    Bug,
    Wrench,
    Calendar,
    ChevronRight,
    MoreVertical,
    GitBranch,
    Rocket,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    useChangelog,
    useCreateChangelogVersion,
    useUpdateChangelogVersion,
    useDeleteChangelogVersion,
    useAddChangelogChange,
    useDeleteChangelogChange,
    type ChangelogEntry,
} from "@/hooks/useChangelog";

const versionTypes = {
    major: { label: "Major", color: "from-red-500 to-orange-500", bg: "bg-red-500/10", text: "text-red-500", badge: "bg-red-500" },
    minor: { label: "Minor", color: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10", text: "text-blue-500", badge: "bg-blue-500" },
    patch: { label: "Patch", color: "from-emerald-500 to-teal-500", bg: "bg-emerald-500/10", text: "text-emerald-500", badge: "bg-emerald-500" },
};

const changeTypes = {
    feature: { label: "New Feature", icon: Sparkles, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    improvement: { label: "Improvement", icon: Wrench, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    fix: { label: "Bug Fix", icon: Bug, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
} as const;

const ChangelogPage = () => {
    const { data: changelog = [], isLoading } = useChangelog();
    const createVersion = useCreateChangelogVersion();
    const updateVersion = useUpdateChangelogVersion();
    const deleteVersion = useDeleteChangelogVersion();
    const addChange = useAddChangelogChange();
    const deleteChange = useDeleteChangelogChange();

    const [searchQuery, setSearchQuery] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(changelog[0]?.id || null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<ChangelogEntry | null>(null);
    const [formData, setFormData] = useState({
        version: "",
        title: "",
        date: new Date().toISOString().split("T")[0],
        type: "minor" as "major" | "minor" | "patch",
        changes: [{ category: "feature" as "feature" | "improvement" | "fix", description: "" }],
    });

    // Filter changelog
    const filteredChangelog = changelog.filter((entry) => {
        return (
            entry.version?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.changes.some((c) =>
                c.description?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    });

    // Stats
    const stats = {
        total: changelog.length,
        features: changelog.flatMap(e => e.changes).filter(c => c.category === "feature").length,
        fixes: changelog.flatMap(e => e.changes).filter(c => c.category === "fix").length,
        improvements: changelog.flatMap(e => e.changes).filter(c => c.category === "improvement").length,
    };

    const handleCreate = () => {
        setEditingEntry(null);
        setFormData({
            version: "",
            title: "",
            date: new Date().toISOString().split("T")[0],
            type: "minor",
            changes: [{ category: "feature", description: "" }],
        });
        setIsDialogOpen(true);
    };

    const handleEdit = (entry: ChangelogEntry) => {
        setEditingEntry(entry);
        setFormData({
            version: entry.version || "",
            title: entry.title || "",
            date: entry.date || new Date().toISOString().split("T")[0],
            type: (entry.type as "major" | "minor" | "patch") || "minor",
            changes: entry.changes.map(c => ({
                category: (c.category as "feature" | "improvement" | "fix") || "feature",
                description: c.description || "",
            })),
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        deleteVersion.mutate(id);
    };

    const handleAddChange = () => {
        setFormData({
            ...formData,
            changes: [...formData.changes, { category: "feature", description: "" }],
        });
    };

    const handleRemoveChange = (index: number) => {
        setFormData({
            ...formData,
            changes: formData.changes.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingEntry) {
            // Update version
            updateVersion.mutate(
                {
                    id: editingEntry.id,
                    version: formData.version,
                    title: formData.title,
                    date: formData.date,
                    type: formData.type,
                },
                {
                    onSuccess: async () => {
                        // Delete old changes
                        for (const change of editingEntry.changes) {
                            await deleteChange.mutateAsync(change.id);
                        }
                        // Add new changes
                        for (let i = 0; i < formData.changes.length; i++) {
                            if (formData.changes[i].description.trim()) {
                                await addChange.mutateAsync({
                                    version_id: editingEntry.id,
                                    category: formData.changes[i].category,
                                    description: formData.changes[i].description,
                                    order_index: i,
                                });
                            }
                        }
                        setIsDialogOpen(false);
                    },
                }
            );
        } else {
            // Create new version
            createVersion.mutate(
                {
                    version: formData.version,
                    title: formData.title,
                    date: formData.date,
                    type: formData.type,
                    is_published: true,
                },
                {
                    onSuccess: async (version) => {
                        // Add changes
                        for (let i = 0; i < formData.changes.length; i++) {
                            if (formData.changes[i].description.trim()) {
                                await addChange.mutateAsync({
                                    version_id: version.id,
                                    category: formData.changes[i].category,
                                    description: formData.changes[i].description,
                                    order_index: i,
                                });
                            }
                        }
                        setIsDialogOpen(false);
                    },
                }
            );
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
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
                            <GitBranch className="h-6 w-6 text-primary" />
                        </div>
                        Changelog
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-1"
                    >
                        Track and publish version updates
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Button onClick={handleCreate} className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25">
                        <Plus className="h-4 w-4" />
                        New Release
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
                    { label: "Releases", value: stats.total, icon: Rocket, color: "text-violet-500", bg: "bg-violet-500/10" },
                    { label: "Features", value: stats.features, icon: Sparkles, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "Improvements", value: stats.improvements, icon: Wrench, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Bug Fixes", value: stats.fixes, icon: Bug, color: "text-orange-500", bg: "bg-orange-500/10" },
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
                        placeholder="Search releases..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background/50"
                    />
                </div>
            </motion.div>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[39px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-border hidden md:block" />

                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredChangelog.map((entry, index) => {
                            const typeConfig = versionTypes[(entry.type as keyof typeof versionTypes) || "minor"];
                            const isExpanded = expandedId === entry.id;

                            return (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="relative md:pl-16"
                                >
                                    {/* Timeline dot */}
                                    <div className="hidden md:flex absolute left-0 top-6 w-20 items-center justify-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.3 + index * 0.05 }}
                                            className={cn(
                                                "h-6 w-6 rounded-full border-4 border-background shadow-lg",
                                                typeConfig.badge
                                            )}
                                        />
                                    </div>

                                    <div
                                        className={cn(
                                            "group rounded-2xl border bg-card/50 backdrop-blur-sm overflow-hidden transition-all",
                                            isExpanded ? "border-primary/30 shadow-lg shadow-primary/5" : "border-border/50 hover:border-primary/20"
                                        )}
                                    >
                                        {/* Header */}
                                        <div
                                            className="flex items-center gap-4 p-5 cursor-pointer"
                                            onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h3 className={cn(
                                                        "text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                                                        typeConfig.color
                                                    )}>
                                                        v{entry.version}
                                                    </h3>
                                                    {entry.title && (
                                                        <span className="text-foreground font-medium">{entry.title}</span>
                                                    )}
                                                    <span className={cn(
                                                        "rounded-full px-2.5 py-0.5 text-xs font-medium border",
                                                        typeConfig.bg,
                                                        typeConfig.text
                                                    )}>
                                                        {typeConfig.label}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {formatDate(entry.date || "")}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {entry.changes.length} change{entry.changes.length !== 1 && "s"}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEdit(entry)}>
                                                            <Edit3 className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => handleDelete(entry.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                <motion.div
                                                    animate={{ rotate: isExpanded ? 90 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Changes */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-5 pb-5 space-y-2">
                                                        {entry.changes.map((change, changeIndex) => {
                                                            const changeConfig = changeTypes[(change.category as keyof typeof changeTypes) || "feature"];
                                                            return (
                                                                <motion.div
                                                                    key={change.id}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: changeIndex * 0.05 }}
                                                                    className={cn(
                                                                        "flex items-start gap-3 rounded-lg border p-3",
                                                                        changeConfig.bg,
                                                                        changeConfig.border
                                                                    )}
                                                                >
                                                                    <changeConfig.icon className={cn("h-4 w-4 mt-0.5 shrink-0", changeConfig.color)} />
                                                                    <div className="flex-1 min-w-0">
                                                                        <span className={cn("text-xs font-medium", changeConfig.color)}>
                                                                            {changeConfig.label}
                                                                        </span>
                                                                        <p className="text-sm text-foreground mt-0.5">{change.description}</p>
                                                                    </div>
                                                                </motion.div>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Empty State */}
            {filteredChangelog.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                >
                    <div className="rounded-2xl bg-muted/30 p-6 mb-4">
                        <GitBranch className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No releases found</h3>
                    <p className="text-muted-foreground mb-4">
                        {searchQuery ? "Try adjusting your search" : "Document your first release"}
                    </p>
                    {!searchQuery && (
                        <Button onClick={handleCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Release
                        </Button>
                    )}
                </motion.div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <GitBranch className="h-4 w-4 text-primary" />
                            </div>
                            {editingEntry ? "Edit Release" : "New Release"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingEntry ? "Update release details" : "Document a new version release"}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="version">Version</Label>
                                <Input
                                    id="version"
                                    value={formData.version}
                                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                    placeholder="1.0.0"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Release title"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, type: value as typeof formData.type })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="major">Major</SelectItem>
                                        <SelectItem value="minor">Minor</SelectItem>
                                        <SelectItem value="patch">Patch</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Release Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>Changes</Label>
                                <Button type="button" variant="outline" size="sm" onClick={handleAddChange}>
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add Change
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {formData.changes.map((change, index) => (
                                    <div key={index} className="flex gap-3 items-start p-3 rounded-lg bg-muted/30 border border-border/50">
                                        <Select
                                            value={change.category}
                                            onValueChange={(value) => {
                                                const newChanges = [...formData.changes];
                                                newChanges[index].category = value as typeof change.category;
                                                setFormData({ ...formData, changes: newChanges });
                                            }}
                                        >
                                            <SelectTrigger className="w-36 shrink-0">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="feature">Feature</SelectItem>
                                                <SelectItem value="improvement">Improvement</SelectItem>
                                                <SelectItem value="fix">Bug Fix</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            value={change.description}
                                            onChange={(e) => {
                                                const newChanges = [...formData.changes];
                                                newChanges[index].description = e.target.value;
                                                setFormData({ ...formData, changes: newChanges });
                                            }}
                                            placeholder="Describe the change..."
                                            required
                                        />
                                        {formData.changes.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 shrink-0 text-destructive"
                                                onClick={() => handleRemoveChange(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-primary to-primary/80"
                                disabled={createVersion.isPending || updateVersion.isPending}
                            >
                                {(createVersion.isPending || updateVersion.isPending) && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {editingEntry ? "Save Changes" : "Create Release"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ChangelogPage;
