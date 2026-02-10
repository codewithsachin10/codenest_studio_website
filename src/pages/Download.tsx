import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download, Monitor, Apple, Terminal, HardDrive, Cpu, Info, Loader2 } from "lucide-react";
import { useLatestReleases } from "@/hooks/useReleases";
import { useTrackDownload } from "@/hooks/useDownloadTracking";
import type { LucideIcon } from "lucide-react";

interface Platform {
  name: string;
  key: "windows" | "macos" | "linux";
  icon: LucideIcon;
  fileType: string;
}

const platformConfig: Platform[] = [
  {
    name: "Windows",
    key: "windows",
    icon: Monitor,
    fileType: ".exe installer",
  },
  {
    name: "macOS",
    key: "macos",
    icon: Apple,
    fileType: ".dmg package",
  },
  {
    name: "Linux",
    key: "linux",
    icon: Terminal,
    fileType: ".AppImage",
  },
];

const installSteps = [
  "Download the installer for your operating system",
  "Run the installer and follow the on-screen prompts",
  "Launch CodeNest Studio from your applications",
  "Select your preferred programming languages",
  "Start coding!",
];

const systemRequirements = [
  { label: "Operating System", value: "Windows 10+, macOS 11+, Ubuntu 20.04+", icon: Monitor },
  { label: "Disk Space", value: "500 MB minimum (more for language packs)", icon: HardDrive },
  { label: "RAM", value: "4 GB minimum, 8 GB recommended", icon: Cpu },
  { label: "Display", value: "1280 x 720 minimum resolution", icon: Info },
];

const DownloadPage = () => {
  const { data: releases = [], isLoading } = useLatestReleases();
  const trackDownload = useTrackDownload();

  const handleDownload = async (platform: "windows" | "macos" | "linux", downloadUrl: string, version: string) => {
    // Track the download
    trackDownload.mutate({ platform, version });

    // Proceed with download
    if (downloadUrl && downloadUrl !== "#") {
      window.open(downloadUrl, "_blank");
    }
  };

  // Get release info for each platform
  const getPlatformRelease = (key: "windows" | "macos" | "linux") => {
    return releases.find((r) => r.platform === key);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Download CodeNest Studio
              </h1>
              <p className="text-muted-foreground">
                Choose your platform and start coding in minutes.
              </p>
            </div>
          </div>
        </section>

        {/* Download Cards */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
                {platformConfig.map((platform) => {
                  const release = getPlatformRelease(platform.key);
                  const version = release?.version || "v1.0.0";
                  const downloadUrl = release?.download_url || "#";
                  const isAvailable = release?.is_available ?? true;

                  return (
                    <div
                      key={platform.name}
                      className="card-hover flex flex-col items-center rounded-xl border border-border/50 bg-surface p-8 text-center"
                    >
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <platform.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="mb-1 text-xl font-semibold text-foreground">
                        {platform.name}
                      </h3>
                      <p className="mb-1 text-sm text-muted-foreground">
                        {version}
                      </p>
                      <p className="mb-6 text-xs text-muted-foreground">
                        {platform.fileType}
                      </p>
                      <Button
                        variant="hero"
                        className="w-full"
                        disabled={!isAvailable}
                        onClick={() => handleDownload(platform.key, downloadUrl, version)}
                      >
                        <Download className="h-4 w-4" />
                        {isAvailable ? "Download" : "Coming Soon"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Installation Instructions */}
        <section className="border-t border-border/30 bg-card/30 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
                Installation Instructions
              </h2>
              <div className="space-y-4">
                {installSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-lg border border-border/30 bg-surface p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* System Requirements */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
                System Requirements
              </h2>
              <div className="overflow-hidden rounded-xl border border-border/50 bg-surface">
                {systemRequirements.map((req, index) => (
                  <div
                    key={req.label}
                    className={`flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between ${index !== systemRequirements.length - 1
                        ? "border-b border-border/30"
                        : ""
                      }`}
                  >
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <req.icon className="h-4 w-4 text-muted-foreground" />
                      {req.label}
                    </span>
                    <span className="text-muted-foreground">{req.value}</span>
                  </div>
                ))}
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
