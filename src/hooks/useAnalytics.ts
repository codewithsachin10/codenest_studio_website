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

const computeChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
};

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

            // Calculate date ranges for current vs previous period (for % change)
            const now = new Date();
            let daysToSubtract = 30;
            switch (timeRange) {
                case "7d": daysToSubtract = 7; break;
                case "90d": daysToSubtract = 90; break;
                case "12m": daysToSubtract = 365; break;
            }
            
            const startDate = new Date(now.getTime() - daysToSubtract * 24 * 60 * 60 * 1000);
            const prevStartDate = new Date(now.getTime() - (daysToSubtract * 2) * 24 * 60 * 60 * 1000);

            try {
                // 1. Get Live Users (active in last 5 minutes)
                const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
                const { count: liveUsers } = await client
                    .from("page_views")
                    .select("*", { count: "exact", head: true })
                    .gte("viewed_at", fiveMinutesAgo);

                // 2. Fetch all Page Views for current and previous period
                const { data: pageViewsData } = await client
                    .from("page_views")
                    .select("viewed_at")
                    .gte("viewed_at", prevStartDate.toISOString());

                const currentViews = (pageViewsData as any[])?.filter(v => new Date(v.viewed_at) >= startDate) || [];
                const previousViews = (pageViewsData as any[])?.filter(v => new Date(v.viewed_at) < startDate) || [];

                // 3. Process chart data (zero padded for every day in range)
                const chartMap = new Map<string, number>();
                
                // Initialize map with 0s to prevent missing days
                for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
                    const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    chartMap.set(dateStr, 0);
                }

                currentViews.forEach(pv => {
                    const date = new Date(pv.viewed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    if (chartMap.has(date)) {
                        chartMap.set(date, chartMap.get(date)! + 1);
                    }
                });

                const recentPageViews = Array.from(chartMap.entries()).map(([date, views]) => ({
                    date,
                    views,
                    visitors: Math.floor(views * 0.7), // Estimate unique visitors
                }));

                // 4. Get Downloads
                const { data: downloadsData } = await client
                    .from("download_stats")
                    .select("platform, downloaded_at")
                    .gte("downloaded_at", prevStartDate.toISOString());

                const currentDownloads = (downloadsData as any[])?.filter(d => new Date(d.downloaded_at) >= startDate) || [];
                const prevDownloads = (downloadsData as any[])?.filter(d => new Date(d.downloaded_at) < startDate) || [];

                // Aggregate downloads by platform (for the current period)
                const downloadsByPlatform = ["windows", "macos", "linux"].map(platform => ({
                    platform,
                    count: currentDownloads.filter(d => d.platform === platform).length,
                }));

                // 5. Get Subscribers
                const { data: subsData } = await client
                    .from("subscribers")
                    .select("created_at")
                    // Note: Supabase doesn't easily track UN-subscribes historically without events, 
                    // so we look at when the active users subscribed.
                    .gte("created_at", prevStartDate.toISOString())
                    .eq("status", "active");

                const currentSubs = (subsData as any[])?.filter(s => new Date(s.created_at) >= startDate).length || 0;
                const prevSubs = (subsData as any[])?.filter(s => new Date(s.created_at) < startDate).length || 0;

                // Total Subscribers (All time, to display massive number)
                const { count: totalSubscribers } = await client
                    .from("subscribers")
                    .select("*", { count: "exact", head: true })
                    .eq("status", "active");

                // Total Downloads (All time)
                const { count: totalDownloadsAllTime } = await client
                    .from("download_stats")
                    .select("*", { count: "exact", head: true });

                // Total Page Views (All time)
                const { count: totalPageViewsAllTime } = await client
                    .from("page_views")
                    .select("*", { count: "exact", head: true });


                return {
                    pageViews: totalPageViewsAllTime || 0,
                    downloads: totalDownloadsAllTime || 0,
                    subscribers: totalSubscribers || 0,
                    liveUsers: liveUsers || 0,
                    bounceRate: 32, // Still placeholder as true bounce needs sessions
                    pageViewsChange: computeChange(currentViews.length, previousViews.length),
                    downloadsChange: computeChange(currentDownloads.length, prevDownloads.length),
                    subscribersChange: computeChange(currentSubs, prevSubs),
                    downloadsByPlatform,
                    recentPageViews,
                    topReferrers: [],
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
