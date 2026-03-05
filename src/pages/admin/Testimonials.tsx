import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Star,
    MoreVertical,
    Edit3,
    Trash2,
    Eye,
    EyeOff,
    Sparkles,
    Users,
    Quote,
    Filter,
    Grid3X3,
    List,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
    useTestimonials,
    useCreateTestimonial,
    useUpdateTestimonial,
    useDeleteTestimonial,
} from "@/hooks/useTestimonials";

interface Testimonial {
    id: string;
    name: string;
    role: string;
    institution: string;
    content: string;
    avatar: string | null;
    rating: number;
    is_highlighted: boolean;
    is_published: boolean;
}



// Star Rating Component
const StarRating = ({
    rating,
    onChange,
    readonly = false,
    size = "default"
}: {
    rating: number;
    onChange?: (rating: number) => void;
    readonly?: boolean;
    size?: "small" | "default";
}) => {
    const [hoverRating, setHoverRating] = useState(0);
    const starSize = size === "small" ? "h-3.5 w-3.5" : "h-5 w-5";

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                    key={star}
                    type="button"
                    disabled={readonly}
                    whileHover={!readonly ? { scale: 1.2 } : {}}
                    whileTap={!readonly ? { scale: 0.9 } : {}}
                    className={cn(
                        "transition-colors",
                        !readonly && "cursor-pointer hover:text-amber-400"
                    )}
                    onMouseEnter={() => !readonly && setHoverRating(star)}
                    onMouseLeave={() => !readonly && setHoverRating(0)}
                    onClick={() => onChange?.(star)}
                >
                    <Star
                        className={cn(
                            starSize,
                            (hoverRating || rating) >= star
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                        )}
                    />
                </motion.button>
            ))}
        </div>
    );
};

// Avatar Component
const Avatar = ({ name, className }: { name: string; className?: string }) => {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const colors = [
        "from-pink-500 to-rose-500",
        "from-violet-500 to-purple-500",
        "from-blue-500 to-cyan-500",
        "from-emerald-500 to-teal-500",
        "from-orange-500 to-amber-500",
    ];

    const colorIndex = name.charCodeAt(0) % colors.length;

    return (
        <div className={cn(
            "flex items-center justify-center rounded-full bg-gradient-to-br text-white font-semibold",
            colors[colorIndex],
            className
        )}>
            {initials}
        </div>
    );
};

const TestimonialsPage = () => {
    // Fetch testimonials from Supabase
    const { data: testimonials = [], isLoading, error } = useTestimonials();
    const createTestimonial = useCreateTestimonial();
    const updateTestimonial = useUpdateTestimonial();
    const deleteTestimonial = useDeleteTestimonial();

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        institution: "",
        content: "",
        rating: 5,
        is_highlighted: false,
        is_published: true,
    });

    // Filter testimonials
    const filteredTestimonials = testimonials.filter((t) => {
        const matchesSearch =
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.institution.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            filterStatus === "all" ||
            (filterStatus === "published" && t.is_published) ||
            (filterStatus === "draft" && !t.is_published);

        return matchesSearch && matchesFilter;
    });

    // Stats
    const stats = {
        total: testimonials.length,
        published: testimonials.filter((t) => t.is_published).length,
        featured: testimonials.filter((t) => t.is_highlighted).length,
        avgRating: (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1),
    };

    const handleCreate = () => {
        setEditingTestimonial(null);
        setFormData({
            name: "",
            role: "",
            institution: "",
            content: "",
            rating: 5,
            is_highlighted: false,
            is_published: true,
        });
        setIsDialogOpen(true);
    };

    const handleEdit = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setFormData({
            name: testimonial.name,
            role: testimonial.role,
            institution: testimonial.institution,
            content: testimonial.content,
            rating: testimonial.rating,
            is_highlighted: testimonial.is_highlighted,
            is_published: testimonial.is_published,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        deleteTestimonial.mutate(id);
    };

    const handleTogglePublish = (id: string) => {
        const testimonial = testimonials.find((t) => t.id === id);
        if (testimonial) {
            updateTestimonial.mutate({
                id,
                is_published: !testimonial.is_published,
            });
        }
    };

    const handleToggleFeatured = (id: string) => {
        const testimonial = testimonials.find((t) => t.id === id);
        if (testimonial) {
            updateTestimonial.mutate({
                id,
                is_highlighted: !testimonial.is_highlighted,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingTestimonial) {
            updateTestimonial.mutate(
                {
                    id: editingTestimonial.id,
                    ...formData,
                },
                {
                    onSuccess: () => setIsDialogOpen(false),
                }
            );
        } else {
            createTestimonial.mutate(
                {
                    ...formData,
                    order_index: testimonials.length,
                },
                {
                    onSuccess: () => setIsDialogOpen(false),
                }
            );
        }
    };

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
                            <Quote className="h-6 w-6 text-primary" />
                        </div>
                        Testimonials
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-1"
                    >
                        Manage customer reviews displayed on your website
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Button onClick={handleCreate} className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25">
                        <Plus className="h-4 w-4" />
                        Add Testimonial
                    </Button>
                </motion.div>
            </div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid gap-4 sm:grid-cols-4"
            >
                {[
                    { label: "Total", value: stats.total, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Published", value: stats.published, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "Featured", value: stats.featured, icon: Sparkles, color: "text-amber-500", bg: "bg-amber-500/10" },
                    { label: "Avg Rating", value: stats.avgRating, icon: Star, color: "text-purple-500", bg: "bg-purple-500/10" },
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
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search testimonials..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-background/50 border-border/50"
                        />
                    </div>
                    <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
                        <SelectTrigger className="w-36 bg-background/50">
                            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Drafts</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-border/50 p-1 bg-background/50">
                    <Button
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="h-8 w-8 p-0"
                    >
                        <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="h-8 w-8 p-0"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </motion.div>

            {/* Testimonials Grid/List */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    layout
                    className={cn(
                        viewMode === "grid"
                            ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                            : "space-y-4"
                    )}
                >
                    {filteredTestimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className={cn(
                                "group relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm transition-all",
                                testimonial.is_highlighted
                                    ? "border-amber-500/30 shadow-lg shadow-amber-500/5"
                                    : "border-border/50",
                                !testimonial.is_published && "opacity-60"
                            )}
                        >
                            {/* Featured badge */}
                            {testimonial.is_highlighted && (
                                <div className="absolute top-0 right-0">
                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg flex items-center gap-1.5">
                                        <Sparkles className="h-3 w-3" />
                                        Featured
                                    </div>
                                </div>
                            )}

                            <div className="p-5">
                                {/* Header */}
                                <div className="flex items-start gap-4 mb-4">
                                    <Avatar name={testimonial.name} className="h-12 w-12 text-sm shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-foreground truncate">{testimonial.name}</h3>
                                            <span
                                                className={cn(
                                                    "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                                                    testimonial.is_published
                                                        ? "bg-emerald-500/10 text-emerald-500"
                                                        : "bg-red-500/10 text-red-500"
                                                )}
                                            >
                                                {testimonial.is_published ? "Published" : "Draft"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {testimonial.role} • {testimonial.institution}
                                        </p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEdit(testimonial)}>
                                                <Edit3 className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleToggleFeatured(testimonial.id)}>
                                                <Sparkles className="mr-2 h-4 w-4" />
                                                {testimonial.is_highlighted ? "Unfeature" : "Feature"}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleTogglePublish(testimonial.id)}>
                                                {testimonial.is_published ? (
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
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => handleDelete(testimonial.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Rating */}
                                <div className="mb-3">
                                    <StarRating rating={testimonial.rating} readonly size="small" />
                                </div>

                                {/* Content */}
                                <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                                    "{testimonial.content}"
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {filteredTestimonials.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                >
                    <div className="rounded-2xl bg-muted/30 p-6 mb-4">
                        <Quote className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No testimonials found</h3>
                    <p className="text-muted-foreground mb-4">
                        {searchQuery ? "Try adjusting your search" : "Get started by adding your first testimonial"}
                    </p>
                    {!searchQuery && (
                        <Button onClick={handleCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Testimonial
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
                                <Quote className="h-4 w-4 text-primary" />
                            </div>
                            {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingTestimonial
                                ? "Update the testimonial details"
                                : "Add a new customer review to display on your website"}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Preview */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                            <Avatar name={formData.name || "Preview"} className="h-14 w-14 text-lg" />
                            <div className="flex-1">
                                <p className="font-semibold text-foreground">
                                    {formData.name || "Customer Name"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {formData.role || "Role"} • {formData.institution || "Institution"}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Input
                                    id="role"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    placeholder="Software Developer"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="institution">Institution / Company</Label>
                            <Input
                                id="institution"
                                value={formData.institution}
                                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                placeholder="Tech Corp"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Testimonial</Label>
                            <Textarea
                                id="content"
                                rows={4}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Share their experience..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Rating</Label>
                            <div className="flex items-center gap-4">
                                <StarRating
                                    rating={formData.rating}
                                    onChange={(rating) => setFormData({ ...formData, rating })}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {formData.rating} star{formData.rating !== 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 p-4 rounded-xl bg-muted/30 border border-border/50">
                            <div className="flex items-center gap-3 flex-1">
                                <Switch
                                    id="featured"
                                    checked={formData.is_highlighted}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, is_highlighted: checked })
                                    }
                                />
                                <Label htmlFor="featured" className="cursor-pointer">
                                    <span className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-amber-500" />
                                        Featured
                                    </span>
                                </Label>
                            </div>
                            <div className="flex items-center gap-3 flex-1">
                                <Switch
                                    id="published"
                                    checked={formData.is_published}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, is_published: checked })
                                    }
                                />
                                <Label htmlFor="published" className="cursor-pointer">
                                    <span className="flex items-center gap-2">
                                        <Eye className="h-4 w-4 text-emerald-500" />
                                        Published
                                    </span>
                                </Label>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-gradient-to-r from-primary to-primary/80">
                                {editingTestimonial ? "Save Changes" : "Create Testimonial"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TestimonialsPage;
