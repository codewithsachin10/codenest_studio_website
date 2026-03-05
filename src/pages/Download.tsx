import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Monitor, 
  Apple, 
  Terminal, 
  HardDrive, 
  Cpu, 
  Info, 
  Loader2, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Box,
  FileCheck,
  Play
} from "lucide-react";
import { useLatestReleases } from "@/hooks/useReleases";
import { useTrackDownload } from "@/hooks/useDownloadTracking";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

interface Platform {
  name: string;
  key: "windows" | "macos" | "linux";
  icon: LucideIcon;
  fileType: string;
  glowClass: string;
  iconColor: string;
}

const platformConfig: Platform[] = [
  {
    name: "Windows",
    key: "windows",
    icon: Monitor,
    fileType: ".exe installer",
    glowClass: "admin-glow-blue",
    iconColor: "text-blue-400",
  },
  {
    name: "macOS",
    key: "macos",
    icon: Apple,
    fileType: ".dmg package",
    glowClass: "admin-glow-primary",
    iconColor: "text-primary",
  },
  {
    name: "Linux",
    key: "linux",
    icon: Terminal,
    fileType: ".AppImage",
    glowClass: "admin-glow-orange",
    iconColor: "text-orange-400",
  },
];

const installSteps = [
  { title: "Download", description: "Get the installer for your OS", icon: Download },
  { title: "Install", description: "Run and follow prompts", icon: Box },
  { title: "Launch", description: "Open CodeNest from Apps", icon: Zap },
  { title: "Setup", description: "Pick your languages", icon: Terminal },
  { title: "Code", description: "Start creating magic", icon: CheckCircle2 },
];

const systemRequirements = [
  { label: "OS", value: "Win 10+, macOS 11+, Ubuntu 20.04+", icon: Monitor },
  { label: "Storage", value: "500 MB min + languages", icon: HardDrive },
  { label: "Memory", value: "4 GB min, 8 GB recommended", icon: Cpu },
  { label: "Screen", value: "1280 x 720 minimum res", icon: Info },
];

const StunningProgressOverlay = ({ progress, isComplete }: { progress: number, isComplete: boolean }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl cyber-grid overflow-hidden border-2 border-primary/50 rounded-3xl"
  >
    {/* Scan Line Animation */}
    <div className="absolute inset-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan z-10" />
    
    <div className="relative z-20 flex flex-col items-center">
      {isComplete ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center text-center"
        >
          <div className="mb-4 rounded-full bg-emerald-500/20 p-4 border border-emerald-500/40 glow-pulse-primary">
            <FileCheck className="h-10 w-10 text-emerald-400" />
          </div>
          <h4 className="text-xl font-black text-white uppercase italic tracking-wider">Download Ready</h4>
          <p className="text-xs text-muted-foreground mt-1">Starting installer automatically...</p>
        </motion.div>
      ) : (
        <>
          <div className="mb-6 relative h-24 w-24">
            <svg className="h-full w-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-white/5"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * progress) / 100}
                className="text-primary glow-primary"
                transition={{ duration: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-black text-white font-mono">{Math.round(progress)}%</span>
            </div>
          </div>
          
          <h4 className="text-sm font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">Syncing Data...</h4>
          
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              className="h-full bg-primary glow-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </>
      )}
    </div>
  </motion.div>
);

const DownloadPage = () => {
  const { data: releases = [], isLoading } = useLatestReleases();
  const trackDownload = useTrackDownload();

  const [downloadingPlatform, setDownloadingPlatform] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleDownload = async (platform: "windows" | "macos" | "linux", downloadUrl: string, version: string) => {
    if (downloadingPlatform) return; // Prevent multiple concurrent downloads

    console.log(`Live download progress enabled for: ${platform}`);
    setDownloadingPlatform(platform);
    setDownloadProgress(0);
    setIsComplete(false);
    
    // Track the attempt
    trackDownload.mutate({ platform, version });

    if (!downloadUrl || downloadUrl === "#") {
      setDownloadingPlatform(null);
      toast.error(`No download link available for ${platform} yet.`);
      return;
    }

    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const contentLength = response.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Body reader not available");

      const chunks: Uint8Array[] = [];
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        loaded += value.length;
        
        if (total > 0) {
          const progress = (loaded / total) * 100;
          setDownloadProgress(progress);
        }
      }

      // Final processing
      setIsComplete(true);
      
      const blob = new Blob(chunks as any);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadUrl.split("/").pop() || `CodeNestStudio-${platform}.${platform === "windows" ? "exe" : platform === "macos" ? "dmg" : "AppImage"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Reset after a short delay
      setTimeout(() => {
        setDownloadingPlatform(null);
        setIsComplete(false);
        toast.success(`${platform} download successful!`);
      }, 2000);

    } catch (err) {
      console.error("Live progress download failed, falling back to direct method:", err);
      // Fallback for CORS or network issues
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadingPlatform(null);
      toast.info(`Starting download for ${platform}...`);
    }
  };

  const getPlatformRelease = (key: "windows" | "macos" | "linux") => {
    return releases.find((r) => r.platform === key);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background admin-mesh-bg selection:bg-primary/30">
      <Header />
      <main className="flex-1 overflow-hidden">
        
        {/* HERO SECTION */}
        <section className="relative py-24 md:py-32 flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-premium-gradient pointer-events-none" />
          <div className="container relative mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 backdrop-blur-md"
            >
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Secure & Verified Builds</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-black md:text-7xl lg:text-8xl tracking-tight text-white mb-6 uppercase italic leading-none"
            >
              Ready to <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x underline decoration-primary/30 underline-offset-8">Level Up?</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto max-w-2xl text-lg text-muted-foreground/80 md:text-xl font-medium"
            >
              CodeNest Studio is your lightweight, distraction-free companion. 
              Engineered for speed, built for flow.
            </motion.p>
          </div>
        </section>

        {/* DOWNLOAD CARDS */}
        <section className="relative pb-24">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3"
              >
                {platformConfig.map((platform) => {
                  const release = getPlatformRelease(platform.key);
                  const version = release?.version || "v1.0.0";
                  const downloadUrl = release?.download_url || "#";
                  const isAvailable = release?.is_published ?? true;
                  const isThisDownloading = downloadingPlatform === platform.key;

                  return (
                    <motion.div
                      key={platform.name}
                      variants={itemVariants}
                      whileHover={!isThisDownloading ? { y: -8, transition: { duration: 0.2 } } : {}}
                      className={cn(
                        "group relative flex flex-col rounded-3xl border border-white/5 p-8 transition-all duration-500 glass-card overflow-hidden h-full",
                        platform.glowClass,
                        isThisDownloading && "ring-2 ring-primary border-primary/40 shadow-[0_0_50px_rgba(var(--primary),0.3)]"
                      )}
                    >
                      <AnimatePresence>
                        {isThisDownloading && (
                          <StunningProgressOverlay progress={downloadProgress} isComplete={isComplete} />
                        )}
                      </AnimatePresence>

                      {/* Decorative Background Icon */}
                      <platform.icon className="absolute -right-8 -top-8 h-40 w-40 opacity-[0.03] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6" />
                      
                      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-xl transition-all duration-500 group-hover:border-primary/40 group-hover:bg-primary/10">
                        <platform.icon className={cn("h-8 w-8 transition-transform duration-500 group-hover:scale-110", platform.iconColor)} />
                      </div>

                      <div className="mb-8 flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                          {platform.name}
                          {isAvailable && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="rounded-lg bg-white/5 px-3 py-1 text-xs font-mono text-white/60 border border-white/5">{version}</span>
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest leading-none text-wrap break-all">{platform.fileType}</span>
                        </div>
                      </div>

                      <Button
                        variant="hero"
                        size="xl"
                        className={cn(
                          "w-full h-14 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300",
                          isAvailable ? "glow-primary" : "bg-white/5 text-white/30 border-white/5 cursor-not-allowed"
                        )}
                        disabled={!isAvailable || !!downloadingPlatform}
                        onClick={() => handleDownload(platform.key, downloadUrl, version)}
                      >
                        {isAvailable ? (
                          <>
                            <Download className="mr-2 h-5 w-5" />
                            Download Now
                          </>
                        ) : (
                          "Coming Soon"
                        )}
                      </Button>
                      
                      {isAvailable && (
                        <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                          Direct High-Speed Trigger
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>

        {/* INSTALLATION STEPS */}
        <section className="relative py-24 border-y border-white/5 bg-white/[0.02]">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-black md:text-5xl tracking-tight text-white uppercase italic">
                Get Started <span className="text-primary">Instantly</span>
              </h2>
            </div>
            
            <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-5">
              {installSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative flex flex-col items-center p-6 text-center"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/5">
                    <step.icon className="h-6 w-6 text-white/50 group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="mb-1 text-sm font-bold text-white uppercase tracking-widest">{step.title}</h4>
                  <p className="text-xs text-muted-foreground/60 leading-relaxed">{step.description}</p>
                  
                  {index < installSteps.length - 1 && (
                    <ChevronRight className="absolute -right-4 top-1/3 hidden h-6 w-6 text-white/10 md:block" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SYSTEM REQUIREMENTS */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl rounded-[2.5rem] border border-white/5 bg-white/[0.03] p-8 md:p-12 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 h-40 w-40 bg-primary/10 blur-[80px] rounded-full" />
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1 text-center md:text-left">
                  <h2 className="mb-4 text-3xl font-black tracking-tight text-white uppercase italic">
                    Technical <br /><span className="text-primary">Specifications</span>
                  </h2>
                  <p className="text-muted-foreground/60 text-sm max-w-xs">
                    Lightweight and optimized to run on almost any modern student machine.
                  </p>
                </div>
                
                <div className="grid flex-1 gap-6 grid-cols-2">
                  {systemRequirements.map((req) => (
                    <div key={req.label} className="group rounded-2xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:border-primary/30">
                      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/20 text-muted-foreground group-hover:text-primary transition-colors">
                        <req.icon className="h-4 w-4" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">{req.label}</p>
                      <p className="text-xs font-semibold text-white/80 leading-tight">{req.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DownloadPage;
