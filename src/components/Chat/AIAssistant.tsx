import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    MessageSquare, 
    X, 
    Send, 
    Bot, 
    User, 
    Sparkles, 
    ChevronDown, 
    Minimize2,
    Command,
    Terminal,
    Cpu,
    Shield,
    Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "assistant" | "user";
    content: string;
    timestamp: Date;
}

const KNOWLEDGE_BASE = [
    {
        keywords: ["hello", "hi", "hey", "who are you"],
        response: "Hello! I'm the CodeNest AI Assistant. I'm here to help you get started with your new favorite offline IDE for students. How can I assist you today?"
    },
    {
        keywords: ["offline", "no internet", "without internet"],
        response: "CodeNest Studio is 100% offline-first. Once you install your language compilers, you can code anywhere—on a plane, in a park, or even during a power outage—with no distraction from the web."
    },
    {
        keywords: ["install", "setup", "how to start"],
        response: "Getting started is easy! \n1. Go to the Download page.\n2. Pick the version for your OS (Windows, macOS, or Linux).\n3. Run the installer.\n4. Open the 'Languages' tab in-app to auto-install Python, C++, or Java."
    },
    {
        keywords: ["languages", "python", "cpp", "java", "c++"],
        response: "Currently, CodeNest Studio supports Python, C++, and Java with world-class syntax highlighting and error checking—all without needing an internet connection."
    },
    {
        keywords: ["price", "cost", "free"],
        response: "CodeNest Studio is free for students! Our mission is to provide the best tools for learners everywhere, regardless of their internet access."
    },
    {
        keywords: ["error", "not working", "help"],
        response: "I'm sorry to hear that! For technical issues, please check our FAQ in the site footer or visit our GitHub repository to report a bug. I can also help with setup instructions if you need them!"
    },
    {
        keywords: ["features", "benefits", "why use"],
        response: "CodeNest Studio offers: \n- Pure Focus: No web distractions.\n- Zero Latency: Everything runs locally.\n- High-End UI: Stunning dark themes.\n- Smart Prefixes: Auto-setup for student projects."
    }
];

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Welcome to CodeNest Studio! I'm your AI guide. Ask me anything about our offline IDE.",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI "Thinking"
        setTimeout(() => {
            const lowerInput = input.toLowerCase();
            let aiResponse = "That's a great question! I'm still learning about specific details, but generally, CodeNest focuses on being the best offline tool for students. Try asking about 'offline mode', 'installation', or 'supported languages'!";

            for (const item of KNOWLEDGE_BASE) {
                if (item.keywords.some(k => lowerInput.includes(k))) {
                    aiResponse = item.response;
                    break;
                }
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: aiResponse,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const suggestedQuestions = [
        "Is it truly offline?",
        "How to install Python?",
        "What languages are supported?"
    ];

    return (
        <div className="fixed bottom-6 right-6 z-[100] font-sans">
            <AnimatePresence>
                {isOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, y: 50, scale: 0.8, rotate: -5 }}
                        className="mb-4 h-[500px] w-[380px] overflow-hidden rounded-[2rem] border border-white/10 bg-black/80 shadow-[0_20px_60px_-15px_rgba(var(--primary),0.3)] backdrop-blur-3xl flex flex-col"
                    >
                        {/* Chat Header */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 p-5 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="rounded-xl bg-primary/20 p-2 border border-primary/30">
                                        <Bot className="h-5 w-5 text-primary" />
                                    </div>
                                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Nest AI</h3>
                                    <div className="flex items-center gap-1">
                                        <Sparkles className="h-2.5 w-2.5 text-primary" />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none">Smart Assistant</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setIsMinimized(true)} className="rounded-lg p-1.5 hover:bg-white/5 transition-colors text-white/50 hover:text-white">
                                    <Minimize2 className="h-4 w-4" />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="rounded-lg p-1.5 hover:bg-white/5 transition-colors text-white/50 hover:text-white">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Chat Context/Welcome */}
                        <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                {[
                                    { icon: Command, label: "Shortcuts" },
                                    { icon: Terminal, label: "Compilers" },
                                    { icon: Cpu, label: "Specs" }
                                ].map((badge, i) => (
                                    <div key={i} className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-white/5 px-2.5 py-1 text-[9px] font-black uppercase text-white/40 border border-white/5 transition-colors hover:border-primary/30 hover:text-primary">
                                        <badge.icon className="h-3 w-3" />
                                        {badge.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar scroll-smooth"
                        >
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={cn(
                                        "flex w-full items-start gap-3",
                                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    <div className={cn(
                                        "h-8 w-8 rounded-lg flex items-center justify-center border",
                                        msg.role === "user" 
                                            ? "bg-white/10 border-white/20" 
                                            : "bg-primary/20 border-primary/30"
                                    )}>
                                        {msg.role === "user" ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-primary" />}
                                    </div>
                                    <div className={cn(
                                        "max-w-[80%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed",
                                        msg.role === "user"
                                            ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20"
                                            : "bg-white/5 text-white/90 border border-white/5 rounded-tl-none"
                                    )}>
                                        {msg.content.split("\n").map((line, i) => (
                                            <p key={i}>{line}</p>
                                        ))}
                                        <span className="mt-1 block text-[9px] font-bold opacity-30 text-right uppercase">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="h-8 w-8 rounded-lg flex items-center justify-center border bg-primary/20 border-primary/30">
                                        <Bot className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="bg-white/5 rounded-2xl px-4 py-3 border border-white/5 rounded-tl-none">
                                        <div className="flex gap-1">
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40 [animation-delay:-0.3s]" />
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.15s]" />
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Suggestions */}
                        {messages.length < 5 && !isTyping && (
                            <div className="px-5 pb-3">
                                <div className="space-y-2">
                                    {suggestedQuestions.map((q, i) => (
                                        <motion.button
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * i }}
                                            onClick={() => { setInput(q); handleSend(); }}
                                            className="block w-full text-left text-[11px] font-bold text-primary/80 hover:text-primary bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-xl px-4 py-2 transition-all"
                                        >
                                            → {q}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Chat Input */}
                        <div className="p-5 bg-white/[0.03] border-t border-white/5">
                            <div className="relative">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Type your message..."
                                    className="h-12 w-full rounded-2xl border-white/10 bg-black/40 pr-12 text-sm focus:border-primary/50 focus:ring-primary/20 backdrop-blur-md"
                                />
                                <button 
                                    onClick={handleSend}
                                    className="absolute right-2 top-1.5 h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/25 transition-transform hover:scale-105 active:scale-95"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                            <p className="mt-3 text-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">
                                Powered by CodeNest Intelligence
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
            >
                {isOpen && isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full right-0 mb-4 rounded-2xl border border-primary/30 bg-black/90 px-4 py-3 shadow-[0_10px_30px_-5px_hsl(var(--primary)/0.3)] backdrop-blur-xl flex items-center gap-3 cursor-pointer group"
                        onClick={() => setIsMinimized(false)}
                    >
                        <div className="relative">
                            <Bot className="h-4 w-4 text-primary" />
                            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                        </div>
                        <span className="text-[11px] font-black text-white uppercase tracking-widest group-hover:text-primary transition-colors">Resume AI Session</span>
                        <ChevronDown className="h-3 w-3 text-white/30 group-hover:text-white transition-colors" />
                    </motion.div>
                )}

                <button
                    onClick={() => {
                        if (isOpen && isMinimized) setIsMinimized(false);
                        else setIsOpen(!isOpen);
                    }}
                    className={cn(
                        "group h-16 w-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-2xl overflow-hidden relative",
                        isOpen && !isMinimized
                            ? "bg-white/10 border border-white/20 rotate-90"
                            : "bg-primary glow-primary border border-white/20"
                    )}
                >
                    <AnimatePresence mode="wait">
                        {isOpen && !isMinimized ? (
                            <motion.div
                                key="close"
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 90 }}
                            >
                                <X className="h-7 w-7 text-white" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="open"
                                initial={{ scale: 0, rotate: 90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: -90 }}
                                className="flex flex-col items-center"
                            >
                                <Sparkles className="h-7 w-7 text-white" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </motion.div>
        </div>
    );
};

export default AIAssistant;
