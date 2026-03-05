import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabase";
import type { Tables, InsertTables, UpdateTables } from "@/lib/database.types";
import { toast } from "sonner";

type Subscriber = Tables<"subscribers">;
type InsertSubscriber = InsertTables<"subscribers">;

export function useSubscribers() {
    return useQuery({
        queryKey: ["subscribers"],
        queryFn: async () => {
            const client = getSupabase();
            if (!client) {
                console.warn("Supabase not configured");
                return [];
            }

            const { data, error } = await client
                .from("subscribers")
                .select("*")
                .order("subscribed_at", { ascending: false });

            if (error) {
                console.error("Error fetching subscribers:", error.message);
                return [];
            }
            return data as Subscriber[];
        },
    });
}

export function useSubscriberStats() {
    return useQuery({
        queryKey: ["subscribers", "stats"],
        queryFn: async () => {
            const client = getSupabase();
            if (!client) {
                console.warn("Supabase not configured");
                return { total: 0, active: 0, unsubscribed: 0, growthRate: 0 };
            }

            const { data, error } = await client
                .from("subscribers")
                .select("status");

            if (error) {
                console.error("Error fetching subscriber stats:", error.message);
                return { total: 0, active: 0, unsubscribed: 0, growthRate: 0 };
            }

            const total = data?.length || 0;
            const active = data?.filter(s => s.status === "active").length || 0;

            return {
                total,
                active,
                unsubscribed: total - active,
                growthRate: 0, // Calculate from historical data when available
            };
        },
    });
}

export function useCreateSubscriber() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (subscriber: InsertSubscriber) => {
            const client = getSupabase();
            if (!client) throw new Error("Supabase not configured");

            const { data, error } = await client
                .from("subscribers")
                .insert(subscriber)
                .select()
                .single();

            if (error) {
                if (error.code === "23505") {
                    throw new Error("Email already subscribed");
                }
                throw error;
            }
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscribers"] });
            toast.success("Subscribed successfully!");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export function useUpdateSubscriberStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: "active" | "unsubscribed" }) => {
            const client = getSupabase();
            if (!client) throw new Error("Supabase not configured");

            const updates: Partial<Subscriber> = { status };
            if (status === "unsubscribed") {
                updates.unsubscribed_at = new Date().toISOString();
            }

            const { data, error } = await client
                .from("subscribers")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscribers"] });
            toast.success("Status updated");
        },
        onError: (error: Error) => {
            toast.error(`Failed to update: ${error.message}`);
        },
    });
}

export function useDeleteSubscriber() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const client = getSupabase();
            if (!client) throw new Error("Supabase not configured");

            const { error } = await client
                .from("subscribers")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscribers"] });
            toast.success("Subscriber deleted");
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete: ${error.message}`);
        },
    });
}

export function useBulkDeleteSubscribers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ids: string[]) => {
            const client = getSupabase();
            if (!client) throw new Error("Supabase not configured");

            const { error } = await client
                .from("subscribers")
                .delete()
                .in("id", ids);

            if (error) throw error;
        },
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({ queryKey: ["subscribers"] });
            toast.success(`${ids.length} subscriber${ids.length > 1 ? "s" : ""} deleted`);
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete: ${error.message}`);
        },
    });
}
