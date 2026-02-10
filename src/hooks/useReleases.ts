import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabase";
import type { Tables, InsertTables, UpdateTables } from "@/lib/database.types";
import { toast } from "sonner";

type Release = Tables<"releases">;
type InsertRelease = InsertTables<"releases">;
type UpdateRelease = UpdateTables<"releases">;

// Mock data for demo mode
const mockReleases: Release[] = [
    {
        id: "1",
        platform: "windows",
        version: "1.2.0",
        download_url: "https://github.com/codenest/releases/download/v1.2.0/CodeNest-Setup-1.2.0.exe",
        file_type: ".exe",
        file_size: "85 MB",
        is_available: true,
        release_notes: "Dark mode and performance improvements",
        created_at: "2024-01-15T00:00:00Z",
    },
    {
        id: "2",
        platform: "macos",
        version: "1.2.0",
        download_url: "https://github.com/codenest/releases/download/v1.2.0/CodeNest-1.2.0.dmg",
        file_type: ".dmg",
        file_size: "92 MB",
        is_available: true,
        release_notes: "Dark mode and performance improvements",
        created_at: "2024-01-15T00:00:00Z",
    },
    {
        id: "3",
        platform: "linux",
        version: "1.2.0",
        download_url: "https://github.com/codenest/releases/download/v1.2.0/CodeNest-1.2.0.AppImage",
        file_type: ".AppImage",
        file_size: "78 MB",
        is_available: true,
        release_notes: "Dark mode and performance improvements",
        created_at: "2024-01-15T00:00:00Z",
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
                query = query.eq("is_available", true);
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
                .eq("is_available", true)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching latest releases:", error.message);
                return [];
            }

            if (!data || data.length === 0) {
                return [];
            }

            // Group by platform and take latest
            const platforms = ["windows", "macos", "linux"] as const;
            const latest = platforms.map(platform =>
                data.find(r => r.platform === platform)
            ).filter(Boolean) as Release[];

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
