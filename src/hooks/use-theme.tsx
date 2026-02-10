import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "codenest-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(STORAGE_KEY) as Theme;
            return stored || "dark";
        }
        return "dark";
    });

    const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark");

    useEffect(() => {
        const root = window.document.documentElement;

        const getResolvedTheme = (): "dark" | "light" => {
            if (theme === "system") {
                return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            }
            return theme;
        };

        const resolved = getResolvedTheme();
        setResolvedTheme(resolved);

        root.classList.remove("light", "dark");
        root.classList.add(resolved);

        // Listen for system theme changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            if (theme === "system") {
                const newResolved = mediaQuery.matches ? "dark" : "light";
                setResolvedTheme(newResolved);
                root.classList.remove("light", "dark");
                root.classList.add(newResolved);
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        localStorage.setItem(STORAGE_KEY, newTheme);
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
