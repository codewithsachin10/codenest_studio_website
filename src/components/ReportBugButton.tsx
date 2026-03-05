import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bug, X, Upload, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateBugReport } from "@/hooks/useBugReports";
import { cn } from "@/lib/utils";

export const ReportBugButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const createReport = useCreateBugReport();

    const [formData, setFormData] = useState({
        type: "bug" as "bug" | "feedback",
        email: "",
        content: "",
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Compress image via canvas to keep Base64 size small enough for a TEXT column
        setIsConverting(true);
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                // Max dimensions
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0, width, height);

                // Export to highly compressed JPEG base64
                const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
                setImagePreview(dataUrl);
                setIsConverting(false);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Harvest system diagnostics
        const metadata = {
            url: window.location.href,
            userAgent: navigator.userAgent,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            language: navigator.language,
        };

        createReport.mutate({
            type: formData.type,
            user_email: formData.email,
            content: formData.content,
            image_url: imagePreview,
            metadata: metadata,
            status: "new"
        }, {
            onSuccess: () => {
                setSuccess(true);
                setTimeout(() => {
                    setIsOpen(false);
                    setTimeout(() => {
                        setSuccess(false);
                        setFormData({ type: "bug", email: "", content: "" });
                        setImagePreview(null);
                    }, 500);
                }, 2000);
            }
        });
    };

    return (
        <>
            {/* Floating Action Button */}
            <motion.div
                className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
            >
                <AnimatePresence>
                    {!isOpen && (
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsOpen(true)}
                            className="group flex h-14 w-14 items-center justify-center rounded-full bg-card border border-border/50 shadow-xl shadow-black/40 xl:h-auto xl:w-auto xl:px-5 hover:bg-white/5 transition-colors gap-3 overflow-hidden backdrop-blur-xl"
                        >
                            <div className="relative flex items-center justify-center">
                                <Bug className="h-6 w-6 text-rose-500 xl:h-5 xl:w-5" />
                                <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl group-hover:bg-rose-500/30 transition-colors" />
                            </div>
                            <span className="hidden font-medium text-foreground xl:block">
                                Report Bug
                            </span>
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Bug Report Modal Wrapper */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="absolute bottom-0 left-0 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col"
                            style={{ 
                                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)" 
                            }}
                        >
                            <div className="flex items-center justify-between border-b border-white/5 p-4 bg-gradient-to-r from-rose-500/10 to-transparent">
                                <div className="flex items-center gap-2">
                                    <Bug className="h-5 w-5 text-rose-500" />
                                    <h3 className="font-semibold text-foreground">Feedback & Issues</h3>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsOpen(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {success ? (
                                <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
                                    <div className="rounded-full bg-emerald-500/10 p-4">
                                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-medium text-foreground">Report Sent!</h4>
                                        <p className="text-sm text-muted-foreground mt-1">Our team will investigate this shortly. Thank you!</p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            onClick={() => setFormData(p => ({...p, type: "bug"}))}
                                            variant={formData.type === "bug" ? "default" : "outline"}
                                            className={cn("flex-1 h-9 bg-card hover:bg-card border-border/50", formData.type === "bug" && "bg-rose-500/20 text-rose-500 border-rose-500/50 hover:bg-rose-500/30")}
                                        >
                                            <Bug className="h-4 w-4 mr-2" /> Bug
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setFormData(p => ({...p, type: "feedback"}))}
                                            variant={formData.type === "feedback" ? "default" : "outline"}
                                            className={cn("flex-1 h-9 bg-card hover:bg-card border-border/50", formData.type === "feedback" && "bg-primary/20 text-primary border-primary/50 hover:bg-primary/30")}
                                        >
                                            Feedback
                                        </Button>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground ml-1">Your Email (Optional)</Label>
                                        <Input 
                                            placeholder="student@school.edu"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(p => ({...p, email: e.target.value}))}
                                            className="h-10 bg-black/40 border-white/10"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground ml-1">Description <span className="text-rose-500">*</span></Label>
                                        <Textarea 
                                            placeholder="Please describe the issue or suggestion..."
                                            value={formData.content}
                                            onChange={(e) => setFormData(p => ({...p, content: e.target.value}))}
                                            className="min-h-[100px] resize-none bg-black/40 border-white/10"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5 border-t border-white/5 pt-4 mt-2">
                                        <Label className="text-xs text-muted-foreground ml-1 flex justify-between items-center">
                                            Attach Screenshot
                                            {imagePreview && (
                                              <button type="button" onClick={() => setImagePreview(null)} className="text-rose-500 hover:text-rose-400">Remove</button>
                                            )}
                                        </Label>
                                        
                                        {!imagePreview ? (
                                            <div 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex items-center justify-center w-full h-16 rounded-lg border-2 border-dashed border-white/10 bg-black/20 hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer overflow-hidden group"
                                            >
                                                <input 
                                                    type="file" 
                                                    ref={fileInputRef} 
                                                    onChange={handleFileChange} 
                                                    className="hidden" 
                                                    accept="image/*"
                                                />
                                                <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
                                                    {isConverting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                                    <span className="text-sm">{isConverting ? "Processing..." : "Click to upload image"}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative w-full h-24 rounded-lg overflow-hidden border border-white/10 bg-black group">
                                                <img src={imagePreview} alt="Screenshot preview" className="w-full h-full object-cover opacity-80" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <ImageIcon className="h-6 w-6 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Button 
                                        type="submit" 
                                        className="w-full mt-2 bg-foreground text-background hover:bg-foreground/90 font-medium tracking-wide h-10"
                                        disabled={!formData.content.trim() || createReport.isPending}
                                    >
                                        {createReport.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Report"}
                                    </Button>
                                </form>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
};
