import { useState } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    GripVertical,
    Edit3,
    Trash2,
    Eye,
    EyeOff,
    MoreVertical,
    Layers,
    Sparkles,
    Code,
    Layout,
    Zap,
    Shield,
    Cloud,
    Palette,
    Terminal,
    GitBranch,
    Settings,
    Box,
    CheckCircle,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    useFeatures,
    useCreateFeature,
    useUpdateFeature,
    useDeleteFeature,
    useUpdateFeatureOrder,
} from "@/hooks/useFeatures";
import type { Tables } from "@/lib/database.types";

type Feature = Tables<"features">;

const iconOptions = [
    { value: "code", icon: Code, label: "Code" },
    { value: "layout", icon: Layout, label: "Layout" },
    { value: "zap", icon: Zap, label: "Lightning" },
    { value: "shield", icon: Shield, label: "Shield" },
    { value: "cloud", icon: Cloud, label: "Cloud" },
    { value: "palette", icon: Palette, label: "Palette" },
    { value: "terminal", icon: Terminal, label: "Terminal" },
    { value: "git-branch", icon: GitBranch, label: "Git" },
    { value: "settings", icon: Settings, label: "Settings" },
    { value: "box", icon: Box, label: "Package" },
    { value: "layers", icon: Layers, label: "Layers" },
    { value: "sparkles", icon: Sparkles, label: "Sparkles" },
];

const getIconComponent = (iconName: string) => {
    const iconConfig = iconOptions.find((i) => i.value === iconName?.toLowerCase());
    return iconConfig?.icon || Code;
};

const FeaturesPage = () => {
    // Fetch features from Supabase
    const { data: features = [], isLoading } = useFeatures();
    const createFeature = useCreateFeature();
    const updateFeature = useUpdateFeature();
    const deleteFeature = useDeleteFeature();
    const updateOrder = useUpdateFeatureOrder();

    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        icon: "code",
        is_published: true,
    });

    // Filter features
    const filteredFeatures = features
        .filter((f) => {
            return (
                f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (f.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
            );
        })
        .sort((a, b) => a.order_index - b.order_index);

    // Stats
    const stats = {
        total: features.length,
        published: features.filter((f) => f.is_published).length,
    };

    const handleCreate = () => {
        setEditingFeature(null);
        setFormData({
            title: "",
            description: "",
            icon: "code",
            is_published: true,
        });
        setIsDialogOpen(true);
    };

    const handleEdit = (feature: Feature) => {
        setEditingFeature(feature);
        setFormData({
            title: feature.title,
            description: feature.description || "",
            icon: feature.icon || "code",
            is_published: feature.is_published,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        deleteFeature.mutate(id);
    };

    const handleTogglePublish = (id: string) => {
        const feature = features.find(f => f.id === id);
        if (feature) {
            updateFeature.mutate({
                id,
                is_published: !feature.is_published,
            });
        }
    };

    const handleReorder = (newOrder: Feature[]) => {
        const items = newOrder.map((feature, index) => ({
            id: feature.id,
            order_index: index,
        }));
        updateOrder.mutate(items);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingFeature) {
            updateFeature.mutate(
                { id: editingFeature.id, ...formData },
                { onSuccess: () => setIsDialogOpen(false) }
            );
        } else {
            createFeature.mutate(
                { ...formData, order_index: features.length },
                { onSuccess: () => setIsDialogOpen(false) }
            );
        }
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
                            <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        Features
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-1"
                    >
                        Manage feature highlights • Drag to reorder
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Button onClick={handleCreate} className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25">
                        <Plus className="h-4 w-4" />
                        Add Feature
                    </Button>
                </motion.div>
            </div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid gap-4 sm:grid-cols-2"
            >
                {[
                    { label: "Total Features", value: stats.total, icon: Layers, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Published", value: stats.published, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
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
                        placeholder="Search features..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background/50"
                    />
                </div>
            </motion.div>

            {/* Features Grid */}
            <Reorder.Group
                axis="y"
                values={filteredFeatures}
                onReorder={handleReorder}
                className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
                <AnimatePresence mode="popLayout">
                    {filteredFeatures.map((feature, index) => {
                        const IconComponent = getIconComponent(feature.icon);
                        return (
                            <Reorder.Item
                                key={feature.id}
                                value={feature}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <motion.div
                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                    className={cn(
                                        "group relative rounded-2xl border bg-card/50 backdrop-blur-sm overflow-hidden transition-all cursor-grab active:cursor-grabbing",
                                        !feature.is_published && "opacity-60",
                                        "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                                        "border-border/50"
                                    )}
                                >
                                    {/* Order Badge */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <div className="flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 px-2 py-1">
                                            <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="absolute top-3 right-3 z-10">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 bg-background/80 backdrop-blur-sm border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(feature)}>
                                                    <Edit3 className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleTogglePublish(feature.id)}>
                                                    {feature.is_published ? (
                                                        <>
                                                            <EyeOff className="mr-2 h-4 w-4" />
                                                            Unpublish
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Publish
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(feature.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="p-6 pt-14">
                                        {/* Icon */}
                                        <div className="mb-4">
                                            <div className="inline-flex rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-4 border border-primary/20">
                                                <IconComponent className="h-8 w-8 text-primary" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-lg text-foreground">{feature.title}</h3>
                                                <span className={cn(
                                                    "rounded-full px-2 py-0.5 text-xs font-medium",
                                                    feature.is_published
                                                        ? "bg-emerald-500/10 text-emerald-500"
                                                        : "bg-gray-500/10 text-gray-500"
                                                )}>
                                                    {feature.is_published ? "Live" : "Draft"}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </Reorder.Item>
                        );
                    })}
                </AnimatePresence>
            </Reorder.Group>

            {/* Empty State */}
            {filteredFeatures.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                >
                    <div className="rounded-2xl bg-muted/30 p-6 mb-4">
                        <Sparkles className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No features found</h3>
                    <p className="text-muted-foreground mb-4">
                        {searchQuery ? "Try adjusting your search" : "Add your first feature"}
                    </p>
                    {!searchQuery && (
                        <Button onClick={handleCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Feature
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
                                <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            {editingFeature ? "Edit Feature" : "Add Feature"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingFeature ? "Update the feature details" : "Add a new feature highlight"}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Icon Picker */}
                        <div className="space-y-3">
                            <Label>Icon</Label>
                            <div className="grid grid-cols-6 gap-2">
                                {iconOptions.map((option) => (
                                    <motion.button
                                        key={option.value}
                                        type="button"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setFormData({ ...formData, icon: option.value })}
                                        className={cn(
                                            "flex items-center justify-center rounded-xl p-3 border-2 transition-all",
                                            formData.icon === option.value
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border/50 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <option.icon className="h-5 w-5" />
                                    </motion.button>
                                ))}
                            </div>
                        </div>

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
                                required
                            />
                        </div>

                        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                            <Switch
                                id="published"
                                checked={formData.is_published}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, is_published: checked })
                                }
                            />
                            <Label htmlFor="published" className="cursor-pointer flex-1">
                                <span className="flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-emerald-500" />
                                    Published
                                </span>
                                <p className="text-xs text-muted-foreground font-normal mt-0.5">
                                    Display this feature on the homepage
                                </p>
                            </Label>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-gradient-to-r from-primary to-primary/80">
                                {editingFeature ? "Save Changes" : "Create Feature"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FeaturesPage;
