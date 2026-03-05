import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldCheck } from "lucide-react";

const PrivacyPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              {/* Header */}
              <div className="mb-12 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Privacy Policy</span>
                </div>
                <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                  Your Privacy Matters
                </h1>
                <p className="text-muted-foreground">
                  Last updated: February 2026
                </p>
              </div>

              {/* Content */}
              <div className="space-y-8 rounded-xl border border-border/50 bg-surface p-8">
                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">
                    Our Commitment
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    CodeNest Studio is designed with privacy as a core principle. We believe your code 
                    is yours alone. This policy explains how we handle (or rather, don't handle) your data.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">
                    Offline-First Architecture
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    CodeNest Studio operates entirely offline. Your source code, project files, and 
                    personal settings are stored locally on your machine. We do not have servers 
                    that receive, process, or store your code.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">
                    No Code Uploads
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We never upload your code to any server. Your projects stay on your computer. 
                    There's no cloud sync, no backup service, and no "AI assistant" that sends 
                    your code elsewhere. Your work remains private.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">
                    Optional Account
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Creating an account is completely optional. You can use the full functionality 
                    of CodeNest Studio without ever signing up. If you choose to create an account 
                    (for features like license sync across devices), we only store your email address 
                    and license information—never your code.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">
                    Analytics & Tracking
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not include any third-party analytics or tracking in the desktop application. 
                    We do not track which languages you use, how long you code, or what you build. 
                    Your usage patterns are none of our business.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">
                    Update Checks
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The application may check for updates when you start it. This only sends the 
                    current version number to our update server to determine if a new version is 
                    available. No personal data is transmitted during this check.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-xl font-semibold text-foreground">
                    Contact
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have questions about this privacy policy or our practices, please reach 
                    out to us at privacy@codenestsudio.com.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
