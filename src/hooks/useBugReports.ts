import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabase";
import type { Tables, InsertTables, UpdateTables } from "@/lib/database.types";
import { toast } from "sonner";

type BugReport = Tables<"user_feedback">;
type InsertBugReport = InsertTables<"user_feedback">;
type UpdateBugReport = UpdateTables<"user_feedback">;

// Temporary mock data for the demo view if Supabase fails
const mockBugReports: BugReport[] = [
    {
        id: "1",
        type: "bug",
        content: "When I try to install the Windows version, the smart screen blocks it. Can you help?",
        user_email: "student1@example.com",
        image_url: null,
        metadata: null,
        status: "new",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "2",
        type: "feedback",
        content: "The new UI is literally amazing. I love the neon glowing aesthetic. Would be cool to have a custom theme color option for the IDE itself.",
        user_email: "designer@school.edu",
        image_url: "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=800",
        metadata: null,
        status: "investigating",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: "3",
        type: "bug",
        content: "The Python compiler doesn't recognize numpy locally.",
        user_email: "python_dev@college.org",
        image_url: null,
        metadata: null,
        status: "resolved",
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
    }
];

export function useBugReports() {
    return useQuery({
        queryKey: ["bug_reports"],
        queryFn: async () => {
            const client = getSupabase();
            if (!client) return mockBugReports;

            const { data, error } = await client
                .from("user_feedback")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching bug reports:", error.message);
                return mockBugReports;
            }
            return data as BugReport[];
        },
    });
}

export function useCreateBugReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (report: InsertBugReport) => {
            const client = getSupabase();
            if (!client) {
                // If no db, just simulate success for UI demo
                console.log("Mock submitted report:", report);
                return { ...report, id: "mock-id", created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
            }

            const { data, error } = await client
                .from("user_feedback")
                .insert(report as any)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bug_reports"] });
        },
    });
}

export function useUpdateBugReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: UpdateBugReport & { id: string }) => {
            const client = getSupabase();
            if (!client) throw new Error("Supabase not configured");

            const { data, error } = await client
                .from("user_feedback")
                .update(updates as any)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bug_reports"] });
            toast.success("Status updated!");
        },
        onError: (error: Error) => {
            toast.error(`Update failed: ${error.message}`);
        },
    });
}

export function useDeleteBugReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const client = getSupabase();
            if (!client) throw new Error("Supabase not configured");

            const { error } = await client
                .from("user_feedback")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bug_reports"] });
            toast.success("Ticket deleted");
        },
        onError: (error: Error) => {
            toast.error(`Delete failed: ${error.message}`);
        },
    });
}
