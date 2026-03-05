import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabase";
import type { Tables, InsertTables, UpdateTables } from "@/lib/database.types";
import { toast } from "sonner";

type Release = Tables<"releases">;
type InsertRelease = InsertTables<"releases">;
type UpdateRelease = UpdateTables<"releases">;

// Mock data for production v1.0.0 release
const mockReleases: Release[] = [
    {
        id: "1",
        platform: "windows",
        version: "v1.0.0",
        download_url: "https://github.com/codewithsachin10/CodeNest_Editor_OFF/releases/download/v1.0.0/CodeNestStudio-1.0.0-win.exe",
        file_type: ".exe",
        file_size: "120 MB",
        is_published: true,
        release_notes: "Initial v1.0.0 stable release",
        created_at: new Date().toISOString(),
    },
    {
        id: "2",
        platform: "macos",
        version: "v1.0.0",
        download_url: "https://github.com/codewithsachin10/CodeNest_Editor_OFF/releases/download/v1.0.0/CodeNestStudio-1.0.0-mac.dmg",
        file_type: ".dmg",
        file_size: "142 MB",
        is_published: true,
        release_notes: "Initial v1.0.0 stable release",
        created_at: new Date().toISOString(),
    },
    {
        id: "3",
        platform: "linux",
        version: "v1.0.0",
        download_url: "#",
        file_type: ".AppImage",
        file_size: "N/A",
        is_published: false,
        release_notes: "Coming soon",
        created_at: new Date().toISOString(),
    },
];

export function useReleases(availableOnly = false) {
    return useQuery({
        queryKey: ["releases", { availableOnly }],
        queryFn: async () => {
            const client = getSupabase();
            if (!client) {
                console.warn("Supabase not configured");
                return [];
            }

            let query = client
                .from("releases")
                .select("*")
                .order("created_at", { ascending: false });

            if (availableOnly) {
                query = query.eq("is_published", true);
            }

            const { data, error } = await query;
            if (error) {
                console.error("Error fetching releases:", error.message);
                return [];
            }
            return data as Release[];
        },
    });
}

export function useLatestReleases() {
    return useQuery({
        queryKey: ["releases", "latest"],
        queryFn: async () => {
            const client = getSupabase();
            if (!client) {
                console.warn("Supabase not configured");
                return [];
            }

            // Get latest available release for each platform
            const { data, error } = await client
                .from("releases")
                .select("*")
                .eq("is_published", true)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching latest releases:", error.message);
                return mockReleases;
            }

            if (!data || data.length === 0) {
                return mockReleases;
            }

            // Group by platform and take latest
            const platforms = ["windows", "macos", "linux"] as const;
            const latest = platforms.map(platform =>
                data.find(r => r.platform === platform)
            ).filter(Boolean) as Release[];

            // Fallback to mock data if no releases found in DB for any platform
            if (latest.length === 0) return mockReleases;

            return latest;
        },
    });
}

export function useCreateRelease() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (release: InsertRelease) => {
            const client = getSupabase();
            if (!client) throw new Error("Supabase not configured");

            const { data, error } = await client
                .from("releases")
                .insert(release)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["releases"] });
            toast.success("Release created successfully");
        },
        onError: (error: Error) => {
            toast.error(`Failed to create: ${error.message}`);
        },
    });
}

export function useUpdateRelease() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: UpdateRelease & { id: string }) => {
            const client = getSupabase();
            if (!client) throw new Error("Supabase not configured");

            const { data, error } = await client
                .from("releases")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["releases"] });
            toast.success("Release updated successfully");
        },
        onError: (error: Error) => {
            toast.error(`Failed to update: ${error.message}`);
        },
    });
}

export function useDeleteRelease() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const client = getSupabase();
            if (!client) throw new Error("Supabase not configured");

            const { error } = await client
                .from("releases")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["releases"] });
            toast.success("Release deleted");
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete: ${error.message}`);
        },
    });
}

// Track downloads
export function useTrackDownload() {
    return useMutation({
        mutationFn: async (platform: string) => {
            const client = getSupabase();
            if (!client) return; // Silently skip in demo mode

            const { error } = await client
                .from("download_stats")
                .insert({ platform });

            if (error) console.error("Failed to track download:", error);
        },
    });
}
