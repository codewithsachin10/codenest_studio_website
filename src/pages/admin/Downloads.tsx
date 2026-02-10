import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Download,
    Monitor,
    Apple,
    Terminal,
    MoreVertical,
    Eye,
    EyeOff,
    Calendar,
    Package,
    HardDrive,
    CheckCircle,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
    useReleases,
    useCreateRelease,
    useUpdateRelease,
    useDeleteRelease,
} from "@/hooks/useReleases";

const platformConfig = {
    windows: {
        name: "Windows",
        icon: Monitor,
        color: "text-sky-500",
        bg: "bg-sky-500/10",
        border: "border-sky-500/20",
        gradient: "from-sky-500 to-blue-500",
    },
    macos: {
        name: "macOS",
        icon: Apple,
        color: "text-gray-500",
        bg: "bg-gray-500/10",
        border: "border-gray-500/20",
        gradient: "from-gray-400 to-gray-600",
    },
    linux: {
        name: "Linux",
        icon: Terminal,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        gradient: "from-orange-500 to-amber-500",
    },
};

const DownloadsPage = () => {
    const { data: releases = [], isLoading } = useReleases();
    const createRelease = useCreateRelease();
    const updateRelease = useUpdateRelease();
    const deleteRelease = useDeleteRelease();

    const [searchQuery, setSearchQuery] = useState("");
    const [filterPlatform, setFilterPlatform] = useState<string>("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRelease, setEditingRelease] = useState<any | null>(null);
    const [formData, setFormData] = useState({
        version: "",
        platform: "windows" as "windows" | "macos" | "linux",
        file_type: ".exe",
        file_size: "",
        download_url: "",
        release_notes: "",
        is_available: true,
    });

    // Filter releases
    const filteredReleases = releases.filter((r) => {
        const matchesSearch =
            r.version?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.download_url?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPlatform = filterPlatform === "all" || r.platform === filterPlatform;
        return matchesSearch && matchesPlatform;
    });

    const handleCreate = () => {
        setEditingRelease(null);
        setFormData({
            version: "",
            platform: "windows",
            file_type: ".exe",
            file_size: "",
            download_url: "",
            release_notes: "",
            is_available: true,
        });
        setIsDialogOpen(true);
    };

    const handleEdit = (release: any) => {
        setEditingRelease(release);
        setFormData({
            version: release.version || "",
            platform: release.platform || "windows",
            file_type: release.file_type || ".exe",
            file_size: release.file_size || "",
            download_url: release.download_url || "",
            release_notes: release.release_notes || "",
            is_available: release.is_available ?? true,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        deleteRelease.mutate(id);
    };

    const handleToggleAvailability = (release: any) => {
        updateRelease.mutate({
            id: release.id,
            is_available: !release.is_available,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingRelease) {
            updateRelease.mutate(
                { id: editingRelease.id, ...formData },
                { onSuccess: () => setIsDialogOpen(false) }
            );
        } else {
            createRelease.mutate(formData, {
                onSuccess: () => setIsDialogOpen(false),
            });
        }
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
                            <Download className="h-6 w-6 text-primary" />
                        </div>
                        Downloads
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-1"
                    >
                        Manage release files for each platform
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Button onClick={handleCreate} className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25">
                        <Plus className="h-4 w-4" />
                        Add Release
                    </Button>
                </motion.div>
            </div>

            {/* Platform Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid gap-4 lg:grid-cols-3"
            >
                {(["windows", "macos", "linux"] as const).map((platform, index) => {
                    const config = platformConfig[platform];
                    const count = releases.filter(r => r.platform === platform).length;

                    return (
                        <motion.div
                            key={platform}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                            className={cn(
                                "rounded-2xl border p-5",
                                config.bg,
                                config.border
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn("rounded-xl p-2.5", config.bg)}>
                                        <config.icon className={cn("h-5 w-5", config.color)} />
                                    </div>
                                    <span className="font-semibold text-foreground">{config.name}</span>
                                </div>
                                <span className={cn("text-2xl font-bold", config.color)}>
                                    {count}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {count === 1 ? "1 release" : `${count} releases`}
                            </p>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Toolbar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search releases..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background/50"
                    />
                </div>
                <div className="flex gap-2">
                    {["all", "windows", "macos", "linux"].map((platform) => {
                        const config = platform !== "all" ? platformConfig[platform as keyof typeof platformConfig] : null;
                        return (
                            <Button
                                key={platform}
                                variant={filterPlatform === platform ? "secondary" : "outline"}
                                size="sm"
                                className="h-9"
                                onClick={() => setFilterPlatform(platform)}
                            >
                                {config && <config.icon className="h-4 w-4 mr-1.5" />}
                                {platform === "all" ? "All" : config?.name}
                            </Button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Releases Grid */}
            <AnimatePresence mode="popLayout">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredReleases.map((release, index) => {
                        const config = platformConfig[release.platform as keyof typeof platformConfig] || platformConfig.windows;
                        return (
                            <motion.div
                                key={release.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.03 }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className={cn(
                                    "group relative rounded-2xl border bg-card/50 overflow-hidden transition-all",
                                    !release.is_available && "opacity-60",
                                    release.is_available ? "border-border/50 hover:border-primary/30" : "border-border/30"
                                )}
                            >
                                {/* Platform Header */}
                                <div className={cn(
                                    "h-2 bg-gradient-to-r",
                                    config.gradient
                                )} />

                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("rounded-xl p-2.5", config.bg)}>
                                                <config.icon className={cn("h-5 w-5", config.color)} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                                    {config.name}
                                                    <span className="text-sm font-medium text-primary">v{release.version}</span>
                                                </h3>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(release.created_at || new Date().toISOString())}
                                                </p>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(release)}>
                                                    <Edit3 className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleToggleAvailability(release)}>
                                                    {release.is_available ? (
                                                        <>
                                                            <EyeOff className="mr-2 h-4 w-4" />
                                                            Disable
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Enable
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(release.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* File Info */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Package className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground truncate">{release.file_type}</span>
                                        </div>
                                        {release.file_size && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <HardDrive className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-muted-foreground">{release.file_size}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                        <a
                                            href={release.download_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-muted-foreground hover:text-primary truncate max-w-[150px]"
                                        >
                                            {release.download_url}
                                        </a>
                                        <span className={cn(
                                            "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                                            release.is_available
                                                ? "bg-emerald-500/10 text-emerald-500"
                                                : "bg-gray-500/10 text-gray-500"
                                        )}>
                                            {release.is_available ? (
                                                <>
                                                    <CheckCircle className="h-3 w-3" />
                                                    Available
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="h-3 w-3" />
                                                    Disabled
                                                </>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </AnimatePresence>

            {/* Empty State */}
            {filteredReleases.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                >
                    <div className="rounded-2xl bg-muted/30 p-6 mb-4">
                        <Download className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No releases found</h3>
                    <p className="text-muted-foreground mb-4">
                        {searchQuery ? "Try adjusting your search" : "Upload your first release"}
                    </p>
                    {!searchQuery && (
                        <Button onClick={handleCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Release
                        </Button>
                    )}
                </motion.div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <Download className="h-4 w-4 text-primary" />
                            </div>
                            {editingRelease ? "Edit Release" : "Add Release"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingRelease ? "Update the release details" : "Add a new downloadable release"}
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
                                <Label htmlFor="platform">Platform</Label>
                                <Select
                                    value={formData.platform}
                                    onValueChange={(value) => setFormData({ ...formData, platform: value as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="windows">Windows</SelectItem>
                                        <SelectItem value="macos">macOS</SelectItem>
                                        <SelectItem value="linux">Linux</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="file_type">File Type</Label>
                                <Input
                                    id="file_type"
                                    value={formData.file_type}
                                    onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
                                    placeholder=".exe"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="file_size">File Size</Label>
                                <Input
                                    id="file_size"
                                    value={formData.file_size}
                                    onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                                    placeholder="150 MB"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="download_url">Download URL</Label>
                            <Input
                                id="download_url"
                                value={formData.download_url}
                                onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                                placeholder="https://github.com/..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="release_notes">Release Notes</Label>
                            <Textarea
                                id="release_notes"
                                value={formData.release_notes}
                                onChange={(e) => setFormData({ ...formData, release_notes: e.target.value })}
                                placeholder="What's new in this release..."
                                rows={3}
                            />
                        </div>

                        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                            <Switch
                                id="available"
                                checked={formData.is_available}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                            />
                            <Label htmlFor="available" className="cursor-pointer flex-1">
                                <span className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    Available for Download
                                </span>
                                <p className="text-xs text-muted-foreground font-normal mt-0.5">
                                    Make this release publicly accessible
                                </p>
                            </Label>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-primary to-primary/80"
                                disabled={createRelease.isPending || updateRelease.isPending}
                            >
                                {(createRelease.isPending || updateRelease.isPending) && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {editingRelease ? "Save Changes" : "Create Release"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DownloadsPage;
