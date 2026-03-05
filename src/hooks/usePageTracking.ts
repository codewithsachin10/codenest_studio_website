import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getSupabase } from "@/lib/supabase";

export function usePageTracking() {
    const location = useLocation();

    useEffect(() => {
        const trackPageView = async () => {
            const client = getSupabase();
            if (!client) return;

            try {
                // Get IP and country info from a free API (optional, but good for analytics)
                // For now, we'll just log the path and basic browser info

                await client.from("page_views").insert({
                    page_path: location.pathname,
                    referrer: document.referrer || null,
                    user_agent: navigator.userAgent,
                    // country will be null for now unless we add an IP geolocator
                    viewed_at: new Date().toISOString(),
                });

            } catch (error) {
                console.error("Failed to track page view:", error);
            }
        };

        trackPageView();
    }, [location.pathname]);
}
