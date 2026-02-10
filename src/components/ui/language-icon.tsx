/**
 * LanguageIcon Component
 * 
 * A reusable component for displaying programming language icons.
 * All icons are locally stored SVGs - no CDN dependencies.
 * Icons are inspired by Devicon (MIT licensed).
 * 
 * @example
 * // By file extension
 * <LanguageIcon extension=".py" size="md" />
 * 
 * // By language name
 * <LanguageIcon language="python" size="lg" />
 */

import cIcon from "@/assets/icons/language-c.svg";
import pythonIcon from "@/assets/icons/language-python.svg";
import javaIcon from "@/assets/icons/language-java.svg";
import cppIcon from "@/assets/icons/language-cpp.svg";
import javascriptIcon from "@/assets/icons/language-javascript.svg";
import { cn } from "@/lib/utils";

// Extension to icon mapping
const extensionIconMap: Record<string, string> = {
    ".c": cIcon,
    ".h": cIcon,
    ".py": pythonIcon,
    ".pyw": pythonIcon,
    ".java": javaIcon,
    ".cpp": cppIcon,
    ".cxx": cppIcon,
    ".cc": cppIcon,
    ".hpp": cppIcon,
    ".hxx": cppIcon,
    ".js": javascriptIcon,
    ".mjs": javascriptIcon,
    ".jsx": javascriptIcon,
};

// Language name to icon mapping
const languageIconMap: Record<string, string> = {
    c: cIcon,
    python: pythonIcon,
    java: javaIcon,
    cpp: cppIcon,
    "c++": cppIcon,
    javascript: javascriptIcon,
    js: javascriptIcon,
};

// Size variants for consistent sizing
const sizeVariants = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-8 w-8",
    "2xl": "h-10 w-10",
};

interface LanguageIconProps {
    /** File extension (e.g., ".py", ".java", ".c") */
    extension?: string;
    /** Language name (e.g., "python", "java", "c") */
    language?: string;
    /** Icon size */
    size?: keyof typeof sizeVariants;
    /** Additional CSS classes */
    className?: string;
    /** Whether to show a fallback icon when language is unknown */
    showFallback?: boolean;
}

/**
 * Get the icon path for a given file extension
 */
export const getIconByExtension = (extension: string): string | null => {
    const normalizedExt = extension.toLowerCase();
    return extensionIconMap[normalizedExt] || null;
};

/**
 * Get the icon path for a given language name
 */
export const getIconByLanguage = (language: string): string | null => {
    const normalizedLang = language.toLowerCase();
    return languageIconMap[normalizedLang] || null;
};

/**
 * Get the language name from a file extension
 */
export const getLanguageFromExtension = (extension: string): string | null => {
    const extToLang: Record<string, string> = {
        ".c": "C",
        ".h": "C",
        ".py": "Python",
        ".pyw": "Python",
        ".java": "Java",
        ".cpp": "C++",
        ".cxx": "C++",
        ".cc": "C++",
        ".hpp": "C++",
        ".hxx": "C++",
        ".js": "JavaScript",
        ".mjs": "JavaScript",
        ".jsx": "JavaScript",
    };
    return extToLang[extension.toLowerCase()] || null;
};

const LanguageIcon = ({
    extension,
    language,
    size = "md",
    className,
    showFallback = false,
}: LanguageIconProps) => {
    // Determine the icon source
    let iconSrc: string | null = null;
    let altText = "Programming language";

    if (extension) {
        iconSrc = getIconByExtension(extension);
        const langName = getLanguageFromExtension(extension);
        if (langName) altText = `${langName} language icon`;
    } else if (language) {
        iconSrc = getIconByLanguage(language);
        altText = `${language} language icon`;
    }

    // No icon found
    if (!iconSrc) {
        if (!showFallback) return null;

        // Return a generic file icon placeholder
        return (
            <div
                className={cn(
                    "flex items-center justify-center rounded bg-muted/50",
                    sizeVariants[size],
                    className
                )}
            >
                <span className="text-[8px] font-medium text-muted-foreground">
                    {extension?.slice(1, 3).toUpperCase() || "?"}
                </span>
            </div>
        );
    }

    return (
        <img
            src={iconSrc}
            alt={altText}
            className={cn(sizeVariants[size], "object-contain", className)}
            loading="lazy"
        />
    );
};

export default LanguageIcon;
