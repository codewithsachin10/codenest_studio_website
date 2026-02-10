import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabase";
import type { Tables, InsertTables, UpdateTables } from "@/lib/database.types";
import { toast } from "sonner";

type Feature = Tables<"features">;
type InsertFeature = InsertTables<"features">;
type UpdateFeature = UpdateTables<"features">;

// Mock data for demo mode
const mockFeatures: Feature[] = [
    {
        id: "1",
        icon: "Zap",
        title: "Instant Setup",
        description: "No configuration needed. Just install and start coding immediately.",
        order_index: 0,
        is_published: true,
        created_at: new Date().toISOString(),
    },
    {
        id: "2",
        icon: "Wifi",
        title: "Works Offline",
        description: "Code anywhere without internet. Perfect for travel or low-connectivity areas.",
        order_index: 1,
        is_published: true,
        created_at: new Date().toISOString(),
    },
    {
        id: "3",
        icon: "Code",
        title: "Multi-Language Support",
        description: "Python, Java, C++, JavaScript, and more. All compilers included.",
        order_index: 2,
        is_published: true,
        created_at: new Date().toISOString(),
    },
    {
        id: "4",
        icon: "Palette",
        title: "Beautiful Interface",
        description: "Clean, modern design with dark and light themes. Easy on the eyes.",
        order_index: 3,
        is_published: true,
        created_at: new Date().toISOString(),
    },
    {
        id: "5",
        icon: "Terminal",
        title: "Integrated Terminal",
        description: "Built-in terminal for running commands without leaving the editor.",
        order_index: 4,
        is_published: true,
        created_at: new Date().toISOString(),
    },
    {
        id: "6",
        icon: "Bug",
        title: "Smart Debugging",
        description: "Helpful error messages and debugging tools to fix issues quickly.",
        order_index: 5,
        is_published: true,
        created_at: new Date().toISOString(),
    },
];

export function useFeatures(publishedOnly = false) {
    return useQuery({
        queryKey: ["features", { publishedOnly }],
        queryFn: async () => {
            const client = getSupabase();
            if (!client) {
                console.warn("Supabase not configured");
                return [];
            }

            let query = client
                .from("features")
                .select("*")
                .order("order_index", { ascending: true });

            if (publishedOnly) {
                query = query.eq("is_published", true);
            }

            const { data, error } = await query;
            if (error) {
                console.error("Error fetching features:", error.message);
                return [];
            }
            return data as Feature[];
        },
    });
}

export function useCreateFeature() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (feature: InsertFeature) => {
            const client = getSupabase();
            if (!client) {
                throw new Error("Supabase not configured");
            }

            const { data, error } = await client
                .from("features")
                .insert(feature)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["features"] });
            toast.success("Feature created successfully");
        },
        onError: (error: Error) => {
            toast.error(`Failed to create: ${error.message}`);
        },
    });
}

export function useUpdateFeature() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: UpdateFeature & { id: string }) => {
            const client = getSupabase();
            if (!client) {
                throw new Error("Supabase not configured");
            }

            const { data, error } = await client
                .from("features")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["features"] });
            toast.success("Feature updated successfully");
        },
        onError: (error: Error) => {
            toast.error(`Failed to update: ${error.message}`);
        },
    });
}

export function useDeleteFeature() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const client = getSupabase();
            if (!client) {
                throw new Error("Supabase not configured");
            }

            const { error } = await client
                .from("features")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["features"] });
            toast.success("Feature deleted");
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete: ${error.message}`);
        },
    });
}

export function useUpdateFeatureOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (items: { id: string; order_index: number }[]) => {
            const client = getSupabase();
            if (!client) {
                throw new Error("Supabase not configured");
            }

            const updates = items.map((item) =>
                client
                    .from("features")
                    .update({ order_index: item.order_index })
                    .eq("id", item.id)
            );

            await Promise.all(updates);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["features"] });
        },
    });
}
