import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabase";
import type { Tables, InsertTables, UpdateTables } from "@/lib/database.types";
import { toast } from "sonner";

type ChangelogVersion = Tables<"changelog_versions">;
type ChangelogChange = Tables<"changelog_changes">;
type InsertVersion = InsertTables<"changelog_versions">;
type InsertChange = InsertTables<"changelog_changes">;
type UpdateVersion = UpdateTables<"changelog_versions">;

export interface ChangelogEntry extends ChangelogVersion {
    changes: ChangelogChange[];
}

export function useChangelog(publishedOnly = false) {
    return useQuery({
        queryKey: ["changelog", { publishedOnly }],
        queryFn: async () => {
            const client = getSupabase();
            if (!client) {
                console.warn("Supabase not configured");
                return [];
            }

            let versionsQuery = client
                .from("changelog_versions")
                .select("*")
                .order("date", { ascending: false });

            if (publishedOnly) {
                versionsQuery = versionsQuery.eq("is_published", true);
            }

            const { data: versions, error: versionsError } = await versionsQuery;
            if (versionsError) {
                console.error("Error fetching changelog:", versionsError.message);
                return [];
            }

            if (!versions || versions.length === 0) {
                return [];
            }

            // Get all changes
            const { data: changes, error: changesError } = await client
                .from("changelog_changes")
                .select("*")
                .order("order_index", { ascending: true });

            if (changesError) {
                console.error("Error fetching changes:", changesError.message);
            }

            // Combine versions with their changes
            const entries: ChangelogEntry[] = versions.map((version) => ({
                ...version,
                changes: (changes || []).filter((c) => c.version_id === version.id),
            }));

            return entries;
        },
    });
}

export function useCreateChangelogVersion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (version: InsertVersion) => {
            const client = getSupabase();
            if (!client) throw new Error("Supabase not configured");

            const { data, error } = await client
                .from("changelog_versions")
                .insert(version)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["changelog"] });
            toast.success("Version created successfully");
        },
        onError: (error: Error) => {
            toast.error(`Failed to create: ${error.message}`);
        },
    });
}

export function useUpdateChangelogVersion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: UpdateVersion & { id: string }) => {
            const client = getSupabase();
            if (!client) throw new Error("Supabase not configured");

            const { data, error } = await client
                .from("changelog_versions")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["changelog"] });
            toast.success("Version updated successfully");
        },
        onError: (error: Error) => {
            toast.error(`Failed to update: ${error.message}`);
        },
    });
}

export function useDeleteChangelogVersion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const client = getSupabase();
            if (!client) throw new Error("Supabase not configured");

            const { error } = await client
                .from("changelog_versions")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["changelog"] });
            toast.success("Version deleted");
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete: ${error.message}`);
        },
    });
}

export function useAddChangelogChange() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (change: InsertChange) => {
            const client = getSupabase();
            if (!client) throw new Error("Supabase not configured");

            const { data, error } = await client
                .from("changelog_changes")
                .insert(change)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["changelog"] });
        },
    });
}

export function useDeleteChangelogChange() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const client = getSupabase();
            if (!client) throw new Error("Supabase not configured");

            const { error } = await client
                .from("changelog_changes")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["changelog"] });
        },
    });
}
