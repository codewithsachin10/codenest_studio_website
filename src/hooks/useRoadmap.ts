import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabase";
import { toast } from "sonner";

interface RoadmapItem {
    id: string;
    title: string;
    description: string | null;
    status: "planned" | "in-progress" | "completed";
    quarter: string | null;
    order_index: number;
    created_at: string;
}

type InsertRoadmapItem = Omit<RoadmapItem, "id" | "created_at">;
type UpdateRoadmapItem = Partial<InsertRoadmapItem>;

export function useRoadmap() {
    return useQuery({
        queryKey: ["roadmap"],
        queryFn: async () => {
            const client = getSupabase();
            if (!client) {
                console.warn("Supabase not configured");
                return [];
            }

            const { data, error } = await client
                .from("roadmap_items")
                .select("*")
                .order("order_index", { ascending: true });

            if (error) {
                console.error("Error fetching roadmap:", error.message);
                return [];
            }
            return data as RoadmapItem[];
        },
    });
}

export function useCreateRoadmapItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (item: InsertRoadmapItem) => {
            const client = getSupabase();
            if (!client) throw new Error("Supabase not configured");

            const { data, error } = await client
                .from("roadmap_items")
                .insert(item)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roadmap"] });
            toast.success("Item created successfully");
        },
        onError: (error: Error) => {
            toast.error(`Failed to create: ${error.message}`);
        },
    });
}

export function useUpdateRoadmapItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: UpdateRoadmapItem & { id: string }) => {
            const client = getSupabase();
            if (!client) throw new Error("Supabase not configured");

            const { data, error } = await client
                .from("roadmap_items")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roadmap"] });
            toast.success("Item updated successfully");
        },
        onError: (error: Error) => {
            toast.error(`Failed to update: ${error.message}`);
        },
    });
}

export function useDeleteRoadmapItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const client = getSupabase();
            if (!client) throw new Error("Supabase not configured");

            const { error } = await client
                .from("roadmap_items")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roadmap"] });
            toast.success("Item deleted");
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete: ${error.message}`);
        },
    });
}

export function useUpdateRoadmapOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (items: { id: string; order_index: number; status?: string }[]) => {
            const client = getSupabase();
            if (!client) throw new Error("Supabase not configured");

            const updates = items.map((item) =>
                client
                    .from("roadmap_items")
                    .update({ order_index: item.order_index, ...(item.status && { status: item.status }) })
                    .eq("id", item.id)
            );

            await Promise.all(updates);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roadmap"] });
        },
    });
}
