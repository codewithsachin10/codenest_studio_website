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
    ChevronDown,
    HelpCircle,
    Tag,
    BookOpen,
    CheckCircle,
    Layers,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
    useFaqs,
    useCreateFaq,
    useUpdateFaq,
    useDeleteFaq,
    useUpdateFaqOrder,
} from "@/hooks/useFaqs";

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string | null;
    is_published: boolean;
    order_index: number;
}

const categories = [
    { value: "general", label: "General", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    { value: "installation", label: "Installation", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    { value: "features", label: "Features", color: "bg-violet-500/10 text-violet-500 border-violet-500/20" },
    { value: "troubleshooting", label: "Troubleshooting", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
    { value: "pricing", label: "Pricing", color: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
];



const getCategoryStyle = (category: string) => {
    return categories.find(c => c.value === category)?.color || "bg-gray-500/10 text-gray-500 border-gray-500/20";
};

const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
};

const FAQPage = () => {
    // Fetch FAQs from Supabase
    const { data: faqs = [], isLoading } = useFaqs();
    const createFaq = useCreateFaq();
    const updateFaq = useUpdateFaq();
    const deleteFaq = useDeleteFaq();
    const updateOrder = useUpdateFaqOrder();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        category: "general",
        is_published: true,
    });

    // Filter FAQs
    const filteredFAQs = faqs
        .filter((f) => {
            const matchesSearch =
                f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.answer.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "all" || f.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => a.order_index - b.order_index);

    // Stats
    const stats = {
        total: faqs.length,
        published: faqs.filter(f => f.is_published).length,
        categories: [...new Set(faqs.map(f => f.category))].length,
    };

    const handleCreate = () => {
        setEditingFAQ(null);
        setFormData({
            question: "",
            answer: "",
            category: "general",
            is_published: true,
        });
        setIsDialogOpen(true);
    };

    const handleEdit = (faq: FAQ) => {
        setEditingFAQ(faq);
        setFormData({
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            is_published: faq.is_published,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        deleteFaq.mutate(id);
    };

    const handleTogglePublish = (id: string) => {
        const faq = faqs.find((f) => f.id === id);
        if (faq) {
            updateFaq.mutate({
                id,
                is_published: !faq.is_published,
            });
        }
    };

    const handleReorder = (newOrder: FAQ[]) => {
        const updates = newOrder.map((faq, index) => ({
            id: faq.id,
            order_index: index,
        }));
        updateOrder.mutate(updates);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingFAQ) {
            updateFaq.mutate(
                { id: editingFAQ.id, ...formData },
                { onSuccess: () => setIsDialogOpen(false) }
            );
        } else {
            createFaq.mutate(
                { ...formData, order_index: faqs.length },
                { onSuccess: () => setIsDialogOpen(false) }
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
                            <HelpCircle className="h-6 w-6 text-primary" />
                        </div>
                        FAQ
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-1"
                    >
                        Manage frequently asked questions • Drag to reorder
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Button onClick={handleCreate} className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25">
                        <Plus className="h-4 w-4" />
                        Add FAQ
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
                    { label: "Total FAQs", value: stats.total, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Published", value: stats.published, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "Categories", value: stats.categories, icon: Layers, color: "text-violet-500", bg: "bg-violet-500/10" },
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
                className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search FAQs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background/50"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={selectedCategory === "all" ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory("all")}
                        className="h-9"
                    >
                        All
                    </Button>
                    {categories.map((cat) => (
                        <Button
                            key={cat.value}
                            variant={selectedCategory === cat.value ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(cat.value)}
                            className="h-9"
                        >
                            {cat.label}
                        </Button>
                    ))}
                </div>
            </motion.div>

            {/* FAQ List */}
            <Reorder.Group
                axis="y"
                values={filteredFAQs}
                onReorder={handleReorder}
                className="space-y-3"
            >
                <AnimatePresence mode="popLayout">
                    {filteredFAQs.map((faq, index) => (
                        <Reorder.Item
                            key={faq.id}
                            value={faq}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <motion.div
                                className={cn(
                                    "group rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden transition-all",
                                    "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                                    !faq.is_published && "opacity-60",
                                    expandedId === faq.id ? "border-primary/40" : "border-border/50"
                                )}
                            >
                                {/* Question Header */}
                                <div
                                    className="flex items-center gap-3 p-4 cursor-pointer"
                                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                                >
                                    <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors">
                                        <GripVertical className="h-5 w-5" />
                                    </div>

                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-muted text-sm font-semibold text-muted-foreground shrink-0">
                                        {index + 1}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-medium text-foreground">{faq.question}</h3>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={cn(
                                                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                                                getCategoryStyle(faq.category)
                                            )}>
                                                <Tag className="h-3 w-3" />
                                                {getCategoryLabel(faq.category)}
                                            </span>
                                            <span className={cn(
                                                "rounded-full px-2 py-0.5 text-xs font-medium",
                                                faq.is_published
                                                    ? "bg-emerald-500/10 text-emerald-500"
                                                    : "bg-red-500/10 text-red-500"
                                            )}>
                                                {faq.is_published ? "Published" : "Draft"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(faq);
                                            }}
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTogglePublish(faq.id);
                                            }}
                                        >
                                            {faq.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(faq.id);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <motion.div
                                            animate={{ rotate: expandedId === faq.id ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Answer */}
                                <AnimatePresence>
                                    {expandedId === faq.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 pb-4 pl-20">
                                                <div className="rounded-lg bg-muted/30 p-4 text-sm text-muted-foreground leading-relaxed">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Reorder.Item>
                    ))}
                </AnimatePresence>
            </Reorder.Group>

            {/* Empty State */}
            {filteredFAQs.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                >
                    <div className="rounded-2xl bg-muted/30 p-6 mb-4">
                        <HelpCircle className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No FAQs found</h3>
                    <p className="text-muted-foreground mb-4">
                        {searchQuery ? "Try adjusting your search" : "Get started by adding your first FAQ"}
                    </p>
                    {!searchQuery && (
                        <Button onClick={handleCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add FAQ
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
                                <HelpCircle className="h-4 w-4 text-primary" />
                            </div>
                            {editingFAQ ? "Edit FAQ" : "Add FAQ"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingFAQ
                                ? "Update the FAQ details"
                                : "Add a new frequently asked question"}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="question">Question</Label>
                            <Input
                                id="question"
                                value={formData.question}
                                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                placeholder="How do I...?"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="answer">Answer</Label>
                            <Textarea
                                id="answer"
                                rows={5}
                                value={formData.answer}
                                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                placeholder="Provide a helpful answer..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                    Make this FAQ visible on the website
                                </p>
                            </Label>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-gradient-to-r from-primary to-primary/80">
                                {editingFAQ ? "Save Changes" : "Create FAQ"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FAQPage;
