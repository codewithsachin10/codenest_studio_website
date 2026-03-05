import { Link } from "react-router-dom";
import { Code2, Github, Twitter, Mail, Heart } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Download", href: "/download" },
    { name: "Changelog", href: "/changelog" },
    { name: "Features", href: "/#features" },
  ],
  resources: [
    { name: "Documentation", href: "#", external: true },
    { name: "Getting Started", href: "#", external: true },
    { name: "FAQ", href: "/#faq" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "#" },
    { name: "License", href: "#" },
  ],
};

const socialLinks = [
  { name: "GitHub", href: "https://github.com/codenest-studio", icon: Github },
  { name: "Twitter", href: "https://twitter.com/CodeNestStudio", icon: Twitter },
  { name: "Email", href: "mailto:hello@codenest.studio", icon: Mail },
];

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="mb-4 flex items-center gap-2 font-semibold text-foreground"
            >
              <Code2 className="h-6 w-6 text-primary" />
              <span>CodeNest Studio</span>
            </Link>
            <p className="mb-6 max-w-xs text-sm text-muted-foreground">
              A beginner-friendly, offline IDE designed for students and
              educators. Free, private, and works without internet.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-surface/50 text-muted-foreground transition-all hover:border-primary/30 hover:bg-surface hover:text-foreground"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) =>
                link.external ? (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </a>
                  </li>
                ) : (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/30 pt-8 md:flex-row">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CodeNest Studio. All rights reserved.
            </p>
            <Link to="/admin" className="opacity-0 hover:opacity-100 transition-opacity focus:opacity-100 text-muted-foreground hover:text-primary">
              <span className="sr-only">Admin Dashboard</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </Link>
          </div>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-3.5 w-3.5 text-red-500" /> for
            students everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
