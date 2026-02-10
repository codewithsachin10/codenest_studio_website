import { useMutation } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabase";

interface DownloadData {
    platform: "windows" | "macos" | "linux";
    version?: string;
}

export function useTrackDownload() {
    return useMutation({
        mutationFn: async ({ platform, version }: DownloadData) => {
            const client = getSupabase();
            if (!client) {
                console.warn("Supabase not configured - download not tracked");
                return null;
            }

            const { data, error } = await client
                .from("download_stats")
                .insert({
                    platform,
                    version: version || "1.0.0",
                    downloaded_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) {
                console.error("Failed to track download:", error.message);
                // Don't throw - we still want the download to proceed
                return null;
            }

            return data;
        },
    });
}
