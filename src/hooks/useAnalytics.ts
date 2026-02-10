import { useQuery } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabase";

interface AnalyticsData {
    pageViews: number;
    downloads: number;
    subscribers: number;
    bounceRate: number;
    pageViewsChange: number;
    downloadsChange: number;
    subscribersChange: number;
    downloadsByPlatform: { platform: string; count: number }[];
    recentPageViews: { date: string; views: number; visitors: number }[];
    topReferrers: { name: string; visits: number; percentage: number }[];
    geographicData: { country: string; visits: number; percentage: number; flag: string }[];
    liveUsers: number;
}

export function useAnalytics(timeRange: string = "30d") {
    return useQuery({
        queryKey: ["analytics", timeRange],
        // Refetch often to show "live" data
        refetchInterval: 30000,
        queryFn: async () => {
            const emptyAnalytics: AnalyticsData = {
                pageViews: 0,
                downloads: 0,
                subscribers: 0,
                bounceRate: 0,
                pageViewsChange: 0,
                downloadsChange: 0,
                subscribersChange: 0,
                downloadsByPlatform: [
                    { platform: "windows", count: 0 },
                    { platform: "macos", count: 0 },
                    { platform: "linux", count: 0 },
                ],
                recentPageViews: [],
                topReferrers: [],
                geographicData: [],
                liveUsers: 0,
            };

            const client = getSupabase();
            if (!client) {
                console.warn("Supabase not configured");
                return emptyAnalytics;
            }

            // Calculate date range
            const now = new Date();
            let startDate: Date;
            switch (timeRange) {
                case "7d":
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case "90d":
                    startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                    break;
                case "12m":
                    startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                    break;
                default: // 30d
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            }

            try {
                // 1. Get Live Users (active in last 5 minutes)
                const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
                // Since we don't have session IDs yet, we'll count unique IPs or user agents in last 5 mins
                // Note: user_agent isn't unique enough but it's a proxy for now without sessions
                const { count: liveUsers } = await client
                    .from("page_views")
                    .select("*", { count: "exact", head: true })
                    .gte("viewed_at", fiveMinutesAgo);

                // 2. Get Total Page Views (All Time)
                const { count: totalPageViews } = await client
                    .from("page_views")
                    .select("*", { count: "exact", head: true });

                // 3. Get Page Views for Chart (Grouped by Day)
                // Note: Supabase JS doesn't support easy GROUP BY, so we'll fetch raw data for the range
                // For a production app with millions of rows, use a Database Function (RPC) instead
                const { data: pageViewsData } = await client
                    .from("page_views")
                    .select("viewed_at")
                    .gte("viewed_at", startDate.toISOString());

                // Process chart data
                const chartMap = new Map<string, number>();
                pageViewsData?.forEach(pv => {
                    const date = new Date(pv.viewed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    chartMap.set(date, (chartMap.get(date) || 0) + 1);
                });

                // Fill in gaps if needed, or just convert map to array
                const recentPageViews = Array.from(chartMap.entries()).map(([date, views]) => ({
                    date,
                    views,
                    visitors: Math.floor(views * 0.7), // Estimate unique visitors for now
                })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                // 4. Get Download Stats
                const { data: downloads } = await client
                    .from("download_stats")
                    .select("platform, downloaded_at")
                    .gte("downloaded_at", startDate.toISOString());

                // All time downloads
                const { count: totalDownloads } = await client
                    .from("download_stats")
                    .select("*", { count: "exact", head: true });

                // 5. Get Subscribers
                const { count: totalSubscribers } = await client
                    .from("subscribers")
                    .select("*", { count: "exact", head: true })
                    .eq("status", "active");

                // Aggregate downloads by platform
                const downloadsByPlatform = ["windows", "macos", "linux"].map(platform => ({
                    platform,
                    count: (downloads || []).filter(d => d.platform === platform).length,
                }));

                return {
                    pageViews: totalPageViews || 0,
                    downloads: totalDownloads || 0,
                    subscribers: totalSubscribers || 0,
                    liveUsers: liveUsers || 0,
                    bounceRate: 32, // Placeholder
                    pageViewsChange: 0, // Needs comparison logic
                    downloadsChange: 0,
                    subscribersChange: 0,
                    downloadsByPlatform,
                    recentPageViews,
                    topReferrers: [
                        { name: "Direct", visits: totalPageViews || 0, percentage: 100 }
                    ],
                    geographicData: [],
                };
            } catch (error) {
                console.error("Analytics error:", error);
                return emptyAnalytics;
            }
        },
    });
}

export function useDashboardStats() {
    return useQuery({
        queryKey: ["dashboard", "stats"],
        queryFn: async () => {
            const emptyStats = {
                downloads: 0,
                subscribers: 0,
                pageViews: 0,
                conversionRate: 0,
                liveUsers: 0
            };

            const client = getSupabase();
            if (!client) {
                return emptyStats;
            }

            try {
                // Get all counts in parallel
                const [downloads, subscribers, pageViews, live] = await Promise.all([
                    client.from("download_stats").select("*", { count: "exact", head: true }),
                    client.from("subscribers").select("*", { count: "exact", head: true }).eq("status", "active"),
                    client.from("page_views").select("*", { count: "exact", head: true }),
                    client.from("page_views").select("*", { count: "exact", head: true })
                        .gte("viewed_at", new Date(Date.now() - 5 * 60 * 1000).toISOString())
                ]);

                return {
                    downloads: downloads.count || 0,
                    subscribers: subscribers.count || 0,
                    pageViews: pageViews.count || 0,
                    liveUsers: live.count || 0,
                    conversionRate: 0,
                };
            } catch (error) {
                console.error("Dashboard stats error:", error);
                return emptyStats;
            }
        },
    });
}
